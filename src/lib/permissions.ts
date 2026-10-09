import type { AuthUser, PermissionAction, PermissionResource } from "@/types";

export function can(
  user: AuthUser | null | undefined,
  action: PermissionAction,
  resource: PermissionResource
): boolean {
  if (!user || !user.isActive) {
    return false;
  }

  // Super Admin memiliki akses penuh ke segala sumber daya dan aksi
  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  // Admin Pengurus
  if (user.role === "ADMIN") {
    // Admin tidak diperkenankan mengelola akun user atau audit log (khusus SUPER_ADMIN)
    if (resource === "users" && (action === "create" || action === "delete" || action === "manage")) {
      return false;
    }
    if (resource === "audit_log" && action !== "read") {
      return false;
    }
    if (resource === "settings" && action === "manage") {
      return false;
    }
    return true;
  }

  // Editor Konten
  if (user.role === "EDITOR") {
    const editorAllowedResources: PermissionResource[] = ["posts", "gallery", "opportunities"];
    if (editorAllowedResources.includes(resource)) {
      return ["create", "read", "update"].includes(action);
    }
    return action === "read";
  }

  return false;
}
