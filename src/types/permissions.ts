/**
 * Taksonomi Kunci Izin Granular (Granular Permission Key Taxonomy)
 * UKM PERISAI UMI Information System
 *
 * Format baku: <domain>:<action>
 */

export const PERMISSION_KEYS = [
  // 1. Posts (Berita & Publikasi Ilmiah)
  "posts:read",
  "posts:create",
  "posts:update",
  "posts:publish",
  "posts:delete",

  // 2. Opportunities (Peluang Lomba, Beasiswa, & Hibah)
  "opportunities:read",
  "opportunities:create",
  "opportunities:update",
  "opportunities:delete",

  // 3. Work Programs (Program Kerja Departemen)
  "programs:read",
  "programs:create",
  "programs:update",
  "programs:delete",

  // 5. Members (Struktur Fungsionaris & Anggota)
  "members:read",
  "members:create",
  "members:update",
  "members:delete",

  // 6. Departments (Bidang & Biro Fungsionaris)
  "departments:read",
  "departments:update",
  "departments:manage",

  // 7. Inbox (Pesan Masuk Kontak Publik)
  "inbox:read",
  "inbox:mark_read",
  "inbox:delete",

  // 8. Gallery (Aset & Dokumentasi Media Cloudflare R2)
  "gallery:read",
  "gallery:upload",
  "gallery:delete",

  // 9. Settings (Konfigurasi Global Situs & Variabel Organisasi)
  "settings:read",
  "settings:update",

  // 10. Users (Manajemen Akun Login & Hak Akses RBAC)
  "users:read",
  "users:create",
  "users:update",
  "users:assign_role",

  // 11. Audit Log (Jejak Rekam Mutasi & Keamanan)
  "audit:read",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

/**
 * Konteks pengecekan izin untuk validasi kepemilikan departemen
 */
export interface PermissionContext {
  departmentId?: number | string | null;
  authorId?: string | null;
}
