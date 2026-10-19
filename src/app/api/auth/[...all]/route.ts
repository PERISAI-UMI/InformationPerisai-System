import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionRecord,
  destroySessionRecord,
  verifyPassword,
  hashPassword,
  isLegacyPasswordHash,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.pathname.split("/").pop();

  if (action === "logout") {
    try {
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(
        new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`)
      );
      const token = match ? decodeURIComponent(match[1].trim()) : null;

      if (token) {
        await destroySessionRecord(token);
      }
    } catch (err) {
      console.warn("[auth] Gagal memproses logout pada DB:", err);
    }

    const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  return NextResponse.json(
    { error: "Endpoint tidak ditemukan" },
    { status: 404 }
  );
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const action = url.pathname.split("/").pop();

  if (action === "logout") {
    try {
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(
        new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`)
      );
      const token = match ? decodeURIComponent(match[1].trim()) : null;

      if (token) {
        await destroySessionRecord(token);
      }
    } catch (err) {
      console.warn("[auth] Gagal memproses logout pada DB:", err);
    }

    const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  if (action === "login") {
    try {
      // 1. Rate Limiting untuk mencegah brute-force attacks
      const clientIp =
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "127.0.0.1";

      const rl = checkRateLimit(`auth-login-${clientIp}`, {
        limit: 10,
        windowMs: 60 * 1000,
      });

      if (!rl.isAllowed) {
        return NextResponse.json(
          {
            error:
              "Terlalu banyak percobaan login. Silakan tunggu 1 menit sebelum mencoba kembali.",
          },
          { status: 429 }
        );
      }

      const body = await request.json();
      const identifier = String(
        body.email || body.identifier || body.username || ""
      ).trim();
      const password = String(body.password || "");
      const cleanPrn = identifier.replace(/\s+/g, "").toUpperCase();

      if (!identifier || !password) {
        return NextResponse.json(
          { error: "Email/PRN dan kata sandi wajib diisi." },
          { status: 400 }
        );
      }

      // 2. Validasi Cloudflare Turnstile anti-bot token
      const turnstileToken = String(
        body.turnstileToken || body["cf-turnstile-response"] || ""
      );
      const isHuman = await verifyTurnstileToken(turnstileToken, clientIp);
      if (!isHuman) {
        return NextResponse.json(
          { error: "Verifikasi keamanan Turnstile gagal atau kedaluwarsa. Silakan coba kembali." },
          { status: 403 }
        );
      }

      const anggota = await prisma.mAnggota.findFirst({
        where: {
          OR: [
            { email: identifier.toLowerCase() },
            { idPerisai: cleanPrn },
          ],
        },
        include: {
          akun: {
            include: { role: true },
          },
        },
      });

      // 3. Validasi keberadaan akun dan status aktif (isActive === 1)
      if (!anggota || !anggota.akun || anggota.akun.isActive !== 1) {
        return NextResponse.json(
          { error: "Kredensial login tidak valid atau akun telah dinonaktifkan." },
          { status: 401 }
        );
      }

      const isValid = await verifyPassword(password, anggota.akun.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Kredensial login tidak valid atau akun telah dinonaktifkan." },
          { status: 401 }
        );
      }

      // 4. Migrasi Transparan Hash Kata Sandi (SHA-256 legacy ke Edge-native PBKDF2)
      if (isLegacyPasswordHash(anggota.akun.passwordHash)) {
        try {
          const newHash = await hashPassword(password);
          await prisma.mAkun.update({
            where: { idAkun: anggota.akun.idAkun },
            data: { passwordHash: newHash },
          });
          console.info(
            `[auth] Berhasil memigrasikan hash kata sandi akun ID ${anggota.akun.idAkun} (${anggota.idPerisai}) ke Edge PBKDF2.`
          );
        } catch (migrationErr) {
          console.error(
            `[auth] Gagal memperbarui hash kata sandi akun ID ${anggota.akun.idAkun}:`,
            migrationErr
          );
        }
      }

      // 5. Catat waktu login terakhir (last_login) - wajib di-await agar tidak meninggalkan orphaned I/O di Workers
      const now = Math.floor(Date.now() / 1000);
      try {
        await prisma.mAkun.update({
          where: { idAkun: anggota.akun.idAkun },
          data: { lastLogin: now },
        });
      } catch (lastLoginErr) {
        console.warn("[auth] Gagal memperbarui lastLogin:", lastLoginErr);
      }

      // 6. Generate token ber-entropi tinggi dan simpan sesi ke T_Sesi
      const userAgent = request.headers.get("user-agent") || null;
      const { token } = await createSessionRecord({
        idAkun: anggota.akun.idAkun,
        ipAddress: clientIp,
        userAgent,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: anggota.idPerisai,
          name: anggota.namaLengkap,
          email: anggota.email,
          role: anggota.akun.role.namaRole,
        },
      });

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
      });

      return response;
    } catch (err) {
      console.error("[auth] Terjadi kesalahan saat autentikasi:", err);
      return NextResponse.json(
        { error: "Terjadi kesalahan saat otentikasi." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "Endpoint tidak ditemukan" },
    { status: 404 }
  );
}

