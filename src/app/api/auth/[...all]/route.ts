import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SESSION_COOKIE_NAME, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";


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

      if (!anggota || !anggota.akun) {
        return NextResponse.json({ error: "Kredensial login tidak valid." }, { status: 401 });
      }

      const isValid = await verifyPassword(password, anggota.akun.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Kredensial login tidak valid." }, { status: 401 });
      }

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
        value: anggota.idPerisai,
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
