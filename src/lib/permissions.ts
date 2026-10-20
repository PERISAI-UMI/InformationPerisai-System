import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type {
  AuthUser,
  PermissionAction,
  PermissionResource,
  Session,
  PermissionKey,
  PermissionContext,
} from "@/types";
import { PERMISSION_KEYS } from "@/types";

/**
 * Hitung daftar izin default berdasarkan Role, Jabatan Resmi, dan Departemen pengguna.
 * Menjamin isolasi domain ketat antar-fungsionaris organisasi.
 */
export function computeDefaultPermissions(
  role: AuthUser["role"],
  positionTitle?: string,
  deptSlug?: string
): PermissionKey[] {
  // 1. SUPER_ADMIN: Hak Akses Mutlak ke seluruh 38 kunci izin
  if (role === "SUPER_ADMIN") {
    return [...PERMISSION_KEYS];
  }

  // 2. ADMIN (Pengurus Inti & Kepala Departemen)
  if (role === "ADMIN") {
    const title = (positionTitle || "").trim().toLowerCase();
    const slug = (deptSlug || "").trim().toLowerCase();

    // 2a. Pimpinan Utama: Ketua Umum
    if (title === "ketua umum" || title.includes("ketua umum")) {
      return PERMISSION_KEYS.filter(
        (k) => !k.startsWith("users:") && k !== "audit:read"
      );
    }

    // 2b. Pimpinan Sekretariat: Sekretaris Umum
    if (title === "sekretaris umum" || title.includes("sekretaris umum")) {
      return [
        "inbox:read",
        "inbox:mark_read",
        "inbox:delete",
        "members:read",
        "members:create",
        "members:update",
        "members:delete",
        "programs:read",
        "programs:create",
        "programs:update",
        "programs:delete",
        "departments:read",
        "departments:update",
        "posts:read",
        "opportunities:read",
        "gallery:read",
        "gallery:upload",
        "settings:read",
      ];
    }

    // 2c. Pimpinan Keuangan: Bendahara Umum
    if (title === "bendahara umum" || title.includes("bendahara umum")) {
      return [
        "finance:read",
        "finance:create",
        "finance:update",
        "finance:delete",
        "finance:export",
        "programs:read",
        "departments:read",
        "members:read",
        "gallery:read",
      ];
    }

    // 2d. Kepala Departemen (KADEP) Spesifik Sesuai Tupoksi
    const kadepBasePermissions: PermissionKey[] = [
      "programs:read",
      "programs:create",
      "programs:update",
      "departments:read",
      "members:read",
      "gallery:read",
    ];

    if (slug === "media") {
      return [
        ...kadepBasePermissions,
        "posts:read",
        "posts:create",
        "posts:update",
        "posts:publish",
        "posts:delete",
        "gallery:upload",
        "gallery:delete",
      ];
    }

    if (slug === "humas") {
      return [
        ...kadepBasePermissions,
        "posts:read",
        "posts:create",
        "posts:update",
        "posts:publish",
        "inbox:read",
        "inbox:mark_read",
        "gallery:upload",
      ];
    }

    if (slug === "kompres") {
      return [
        ...kadepBasePermissions,
        "opportunities:read",
        "opportunities:create",
        "opportunities:update",
        "opportunities:delete",
        "gallery:upload",
      ];
    }

    if (slug === "psdm") {
      return [
        ...kadepBasePermissions,
        "members:create",
        "members:update",
        "gallery:upload",
      ];
    }

    if (slug === "penalaran" || slug === "ristek") {
      return [
        ...kadepBasePermissions,
        "posts:read",
        "posts:create",
        "posts:update",
        "opportunities:read",
        "gallery:upload",
      ];
    }

    // Fallback untuk ADMIN umum / pengujian jika metadata jabatan belum diisi
    return [
      "posts:read",
      "posts:create",
      "posts:update",
      "posts:publish",
      "posts:delete",
      "opportunities:read",
      "opportunities:create",
      "opportunities:update",
      "opportunities:delete",
      "finance:read",
      "finance:create",
      "finance:update",
      "finance:delete",
      "finance:export",
      "programs:read",
      "programs:create",
      "programs:update",
      "programs:delete",
      "members:read",
      "members:create",
      "members:update",
      "members:delete",
      "departments:read",
      "departments:update",
      "inbox:read",
      "inbox:mark_read",
      "inbox:delete",
      "gallery:read",
      "gallery:upload",
      "gallery:delete",
      "settings:read",
      "settings:update",
    ];
  }

  // 3. EDITOR: Staf Ahli Departemen Media/Humas atau Kontributor Penulis
  if (role === "EDITOR") {
    return [
      "posts:read",
      "posts:create",
      "posts:update",
      "gallery:read",
      "gallery:upload",
      "opportunities:read",
      "programs:read",
    ];
  }

  // 4. Pengguna Publik / Anggota Biasa
  return ["programs:read", "departments:read"];
}

/**
 * Periksa apakah pengguna memiliki hak izin granular tertentu.
 * Mendukung validasi konteks kepemilikan departemen (department ownership isolation).
 */
export function hasPermission(
  user: AuthUser | null | undefined,
  key: PermissionKey,
  context?: PermissionContext
): boolean {
  if (!user || !user.isActive) {
    return false;
  }

  // Super Admin selalu memiliki izin
  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  // Ambil daftar izin aktif (dari cache sesi atau komputasi default)
  const permissions =
    user.permissions && user.permissions.length > 0
      ? user.permissions
      : computeDefaultPermissions(user.role, user.positionTitle, user.departmentId);

  if (!permissions.includes(key)) {
    return false;
  }

  // Validasi Batas Wilayah Departemen (Department Boundary Check)
  if (context?.departmentId) {
    const isPimpinanInti =
      user.positionTitle === "Ketua Umum" ||
      user.positionTitle === "Sekretaris Umum" ||
      user.tier === "inti";

    // Pimpinan inti memiliki cakupan global seluruh departemen
    if (!isPimpinanInti) {
      const targetDept = String(context.departmentId).toLowerCase();
      const userDeptSlug = (user.departmentId || "").toLowerCase();
      const userDeptNum = user.departmentNumericId ? String(user.departmentNumericId) : null;

      if (targetDept !== userDeptSlug && targetDept !== userDeptNum) {
        return false;
      }
    }
  }

  return true;
}

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

/**
 * Kebijakan legacy RBAC can() untuk kompatibilitas ke belakang (backward compatibility).
 */
export function can(
  user: AuthUser | null | undefined,
  action: PermissionAction,
  resource: PermissionResource
): boolean {
  if (!user || !user.isActive) {
    return false;
  }

  // 1. SUPER_ADMIN: Webmaster (Akses Penuh Mutlak)
  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  // 2. ADMIN: Pengurus Inti & Kepala Departemen
  if (user.role === "ADMIN") {
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

  // 3. EDITOR: Staf Ahli Konten
  if (user.role === "EDITOR") {
    if (resource === "finance") {
      return false;
    }
    const editorAllowedResources: PermissionResource[] = ["posts", "gallery", "opportunities"];
    if (editorAllowedResources.includes(resource)) {
      return ["create", "read", "update"].includes(action);
    }
    return action === "read";
  }

  return false;
}
