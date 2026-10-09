import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { scryptSync, timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = scryptSync(password, salt, keyBuffer.length);
    return timingSafeEqual(keyBuffer, derivedKey);
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
      const { email, password } = await request.json();

      const user = await prisma.user.findUnique({
        where: { email },
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
