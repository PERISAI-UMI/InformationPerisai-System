import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { scryptSync, timingSafeEqual, createHash } from "crypto";

export const dynamic = "force-dynamic";

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash) return false;

    // 1. Format scrypt (salt:key)
    if (storedHash.includes(":")) {
      const [salt, key] = storedHash.split(":");
      if (!salt || !key) return false;
      const keyBuffer = Buffer.from(key, "hex");
      const derivedKey = scryptSync(password, salt, keyBuffer.length);
      return timingSafeEqual(keyBuffer, derivedKey);
    }

    // 2. Format SHA-256 hex (default seed database: "perisai2026")
    const sha256Hex = createHash("sha256").update(password).digest("hex");
    if (storedHash.length === sha256Hex.length) {
      return timingSafeEqual(Buffer.from(storedHash), Buffer.from(sha256Hex));
    }

    return false;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const action = url.pathname.split("/").pop();

  if (action === "logout") {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  if (action === "login") {
    try {
      const body = await request.json();
      const identifier = String(body.email || body.identifier || body.username || "").trim();
      const password = String(body.password || "");
      const cleanPrn = identifier.replace(/\s+/g, "").toUpperCase();

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier.toLowerCase() },
            { id: cleanPrn },
            { prn: cleanPrn },
          ],
        },
        include: { cmsAccess: true },
      });

      if (!user) {
        return NextResponse.json({ error: "Kredensial login tidak valid." }, { status: 401 });
      }

      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Kredensial login tidak valid." }, { status: 401 });
      }

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.namaLengkap,
          email: user.email,
          role: user.cmsAccess?.cmsRole || user.role,
        },
      });

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: user.id,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 hari
      });

      return response;
    } catch {
      return NextResponse.json({ error: "Terjadi kesalahan saat otentikasi." }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Endpoint tidak ditemukan" }, { status: 404 });
}
