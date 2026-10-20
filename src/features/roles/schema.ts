import { z } from "zod";
import { PERMISSION_KEYS, type PermissionKey } from "@/types/permissions";

export const roleSchema = z.object({
  name: z
    .string()
    .min(3, "Nama peran minimal 3 karakter")
    .max(50, "Nama peran maksimal 50 karakter")
    .regex(/^[A-Za-z0-9_ -]+$/, "Nama peran hanya boleh berisi huruf, angka, spasi, atau underscore"),
  label: z
    .string()
    .min(3, "Label tampilan minimal 3 karakter")
    .max(100, "Label tampilan maksimal 100 karakter"),
  description: z
    .string()
    .max(250, "Deskripsi maksimal 250 karakter")
    .optional()
    .or(z.literal("")),
  permissions: z
    .array(z.enum(PERMISSION_KEYS))
    .min(1, "Pilih minimal 1 izin untuk peran ini"),
  assignedUserIds: z
    .array(z.string())
    .optional()
    .default([]),
});

export type RoleInput = z.infer<typeof roleSchema>;

export interface PermissionGroup {
  domain: string;
  label: string;
  description: string;
  permissions: {
    key: PermissionKey;
    label: string;
    description: string;
  }[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    domain: "posts",
    label: "Kabar & Publikasi Berita",
    description: "Pengelolaan artikel berita, opini ilmiah, dan publikasi media",
    permissions: [
      { key: "posts:read", label: "Melihat Berita", description: "Membaca daftar artikel dan draf berita" },
      { key: "posts:create", label: "Membuat Berita", description: "Menulis dan menyimpan naskah berita baru" },
      { key: "posts:update", label: "Mengedit Berita", description: "Memperbarui isi naskah dan cover artikel" },
      { key: "posts:publish", label: "Menerbitkan Berita", description: "Mengubah status menjadi published ke publik" },
      { key: "posts:delete", label: "Menghapus Berita", description: "Menghapus artikel secara permanen" },
    ],
  },
  {
    domain: "opportunities",
    label: "Peluang & Kompetisi",
    description: "Pengelolaan informasi perlombaan, beasiswa, dan hibah mahasiswa",
    permissions: [
      { key: "opportunities:read", label: "Melihat Peluang", description: "Melihat daftar kompetisi dan peluang" },
      { key: "opportunities:create", label: "Menambah Peluang", description: "Mendaftarkan info kompetisi baru" },
      { key: "opportunities:update", label: "Mengedit Peluang", description: "Memperbarui jadwal, link, dan poster" },
      { key: "opportunities:delete", label: "Menghapus Peluang", description: "Menghapus arsip peluang kompetisi" },
    ],
  },
  {
    domain: "finance",
    label: "Keuangan & Kas",
    description: "Pencatatan kas masuk, keluar, dan laporan transparansi keuangan",
    permissions: [
      { key: "finance:read", label: "Melihat Kas", description: "Melihat ringkasan saldo dan riwayat transaksi" },
      { key: "finance:create", label: "Mencatat Transaksi", description: "Menambah pemasukan atau pengeluaran kas" },
      { key: "finance:update", label: "Mengedit Transaksi", description: "Memperbaiki catatan atau bukti nota transaksi" },
      { key: "finance:delete", label: "Menghapus Transaksi", description: "Menghapus pencatatan kas dari sistem" },
      { key: "finance:export", label: "Ekspor Laporan Kas", description: "Mengunduh rekapitulasi data kas Excel/PDF" },
    ],
  },
  {
    domain: "programs",
    label: "Program Kerja (Proker)",
    description: "Perencanaan dan pemantauan program kerja departemen",
    permissions: [
      { key: "programs:read", label: "Melihat Proker", description: "Melihat daftar rencana program kerja" },
      { key: "programs:create", label: "Membuat Proker", description: "Menyusun inisiatif kegiatan baru" },
      { key: "programs:update", label: "Mengedit Proker", description: "Memperbarui target capaian dan indikator" },
      { key: "programs:delete", label: "Menghapus Proker", description: "Menghapus program kerja organisasi" },
    ],
  },
  {
    domain: "members",
    label: "Struktur Fungsionaris & Anggota",
    description: "Database kepengurusan, biodata fungsionaris, dan keanggotaan",
    permissions: [
      { key: "members:read", label: "Melihat Anggota", description: "Melihat direktori pengurus dan profil anggota" },
      { key: "members:create", label: "Menambah Pengurus", description: "Menetapkan fungsionaris dan jabatan baru" },
      { key: "members:update", label: "Mengedit Pengurus", description: "Memperbarui jabatan, status, atau foto pengurus" },
      { key: "members:delete", label: "Menghapus Pengurus", description: "Menghapus entri kepengurusan dari periode" },
    ],
  },
  {
    domain: "departments",
    label: "Departemen & Periode",
    description: "Struktur departemen, biro organisasi, dan tahun periode kepengurusan",
    permissions: [
      { key: "departments:read", label: "Melihat Departemen", description: "Melihat visi, misi, dan tupoksi departemen" },
      { key: "departments:update", label: "Mengedit Departemen", description: "Memperbarui profil dan deskripsi departemen" },
      { key: "departments:manage", label: "Kelola Master & Periode", description: "Membuat departemen baru atau mengaktifkan periode" },
    ],
  },
  {
    domain: "inbox",
    label: "Pesan Masuk & Aspirasi",
    description: "Pesan formulir kontak dari mahasiswa, civitas akademika, dan mitra",
    permissions: [
      { key: "inbox:read", label: "Membaca Pesan", description: "Membaca pesan masuk dan pertanyaan audiens" },
      { key: "inbox:mark_read", label: "Menandai Dibaca", description: "Mengubah status pesan menjadi terbaca/dibalas" },
      { key: "inbox:delete", label: "Menghapus Pesan", description: "Menghapus pesan masuk yang tidak relevan/spam" },
    ],
  },
  {
    domain: "gallery",
    label: "Aset Media & Dokumentasi",
    description: "Penyimpanan foto dokumentasi dan berkas media pada Cloudflare R2",
    permissions: [
      { key: "gallery:read", label: "Melihat Galeri", description: "Melihat repositori media dan aset gambar" },
      { key: "gallery:upload", label: "Unggah Media", description: "Mengunggah dokumentasi kegiatan ke storage" },
      { key: "gallery:delete", label: "Menghapus Media", description: "Menghapus berkas foto/media dari penyimpanan" },
    ],
  },
  {
    domain: "settings",
    label: "Pengaturan Sistem & Variabel",
    description: "Konfigurasi variabel situs web, kontak resmi, dan preferensi CMS",
    permissions: [
      { key: "settings:read", label: "Melihat Pengaturan", description: "Membaca konfigurasi dan variabel sistem" },
      { key: "settings:update", label: "Mengubah Pengaturan", description: "Memperbarui nomor kontak, sosmed, dan branding" },
    ],
  },
  {
    domain: "users",
    label: "Manajemen Akun & Hak Akses",
    description: "Akun login CMS, penetapan peran (role), dan otorisasi RBAC",
    permissions: [
      { key: "users:read", label: "Melihat Akun", description: "Melihat daftar akun CMS dan status aktifasi" },
      { key: "users:create", label: "Membuat Akun", description: "Mendaftarkan akun login baru bagi fungsionaris" },
      { key: "users:update", label: "Mengedit Akun", description: "Mengubah role akun dan status aktif/nonaktif" },
      { key: "users:assign_role", label: "Kelola Peran & Izin", description: "Membuat, mengedit, dan menghapus matriks peran" },
    ],
  },
  {
    domain: "audit",
    label: "Jejak Audit & Keamanan",
    description: "Log aktivitas keamanan sistem dan riwayat seluruh mutasi data",
    permissions: [
      { key: "audit:read", label: "Melihat Log Audit", description: "Mengakses catatan riwayat forensik dan keamanan sistem" },
    ],
  },
];
