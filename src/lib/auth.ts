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

    // Cari user berdasarkan ID yang tercatat pada sesi
    const user = await prisma.user.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        role: true,
        departmentId: true,
        cmsAccess: {
          select: {
            cmsRole: true,
            departmentId: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Tentukan role CMS berdasarkan users.role dan web_user_access
    let cmsRole: AuthUser["role"] = "EDITOR";
    if (user.role === "SUPER_ADMIN" || user.cmsAccess?.cmsRole === "super_admin") {
      cmsRole = "SUPER_ADMIN";
    } else if (user.role === "ADMIN" || user.cmsAccess?.cmsRole === "editor") {
      cmsRole = "ADMIN";
    }

    return {
      user: {
        id: user.id,
        name: user.namaLengkap,
        email: user.email,
        role: cmsRole,
        isActive: true,
        departmentId: user.cmsAccess?.departmentId || user.departmentId || undefined,
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  } catch (err) {
    console.error("Error retrieving session:", err);
    return null;
  }
}

export { SESSION_COOKIE_NAME };
