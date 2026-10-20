import type { AuthUser, PermissionAction, PermissionResource } from "@/types";

export function can(
  user: AuthUser | null | undefined,
  action: PermissionAction,
  resource: PermissionResource
): boolean {
  if (!user || !user.isActive) {
    return false;
  }

  // 1. SUPER_ADMIN: Administrator Teknis / Webmaster (Akses Penuh Mutlak)
  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  // 2. ADMIN: Pengurus Inti & Kepala Departemen (Ketua Umum, Sekum, Bendum, & 6 Kadep)
  if (user.role === "ADMIN") {
    // Pengurus Inti & Kadep tidak diperkenankan mengelola akun user atau audit log (khusus SUPER_ADMIN)
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

  // 3. EDITOR: Staf Ahli Departemen (khususnya Media & Humas) atau Kontributor Penulis
  if (user.role === "EDITOR") {
    // Editor tidak berhak mengakses manajemen keuangan kas
    if (resource === "finance") {
      return false;
    }
    const editorAllowedResources: PermissionResource[] = ["posts", "gallery", "opportunities"];
    if (editorAllowedResources.includes(resource)) {
      return ["create", "read", "update"].includes(action);
    }
    return action === "read";
  }

  // 4. PUBLIC / Anonim: Anggota Biasa, Civitas Akademika UMI, & Pengunjung Umum (Otomatis ditolak untuk mutasi)
  return false;
}
