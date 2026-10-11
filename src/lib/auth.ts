import { cookies } from "next/headers";
import type { AuthUser, Session } from "@/types";
import prisma from "./db";

const SESSION_COOKIE_NAME = "perisai_session_id";

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return null;
    }

    const anggota = await prisma.mAnggota.findUnique({
      where: { idPerisai: sessionId },
      include: {
        akun: {
          include: { role: true },
        },
        kepengurusan: {
          include: { departemen: true },
          take: 1,
        },
      },
    });

    if (!anggota || !anggota.akun) {
      return null;
    }

    let cmsRole: AuthUser["role"] = "EDITOR";
    const roleName = anggota.akun.role.namaRole;
    if (roleName === "SUPER_ADMIN") {
      cmsRole = "SUPER_ADMIN";
    } else if (roleName === "BPH" || roleName === "KADEP") {
      cmsRole = "ADMIN";
    }

    return {
      user: {
        id: anggota.idPerisai,
        name: anggota.namaLengkap,
        email: anggota.email,
        role: cmsRole,
        isActive: Boolean(anggota.akun.isActive),
        departmentId: anggota.kepengurusan[0]?.departemen?.slug || undefined,
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  } catch (err) {
    console.error("Error retrieving session:", err);
    return null;
  }
}

export { SESSION_COOKIE_NAME };
