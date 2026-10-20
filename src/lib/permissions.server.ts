import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasPermission } from "./permissions";
import type { PermissionKey, PermissionContext, Session } from "@/types";

/**
 * Guard Server Component: Memeriksa izin akses halaman panel admin secara ketat.
 * Mengarahkan ke /admin/login jika belum login, atau ke /admin?error=unauthorized jika hak akses tidak terpenuhi.
 */
export async function requirePermission(
  key: PermissionKey,
  context?: PermissionContext
): Promise<Session> {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (!hasPermission(session.user, key, context)) {
    redirect("/admin?error=unauthorized");
  }

  return session;
}
