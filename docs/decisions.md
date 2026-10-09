# Architecture Decision Records (ADR) — UKM PERISAI UMI

Dokumen ini mencatat keputusan-keputusan teknis fundamental dalam perancangan dan pengembangan InformationPerisai-System.

---

## ADR 001: Next.js App Router sebagai Fondasi Utama
- **Status**: Accepted
- **Konteks**: Sistem membutuhkan portal publik dengan performa tinggi (SEO, SSR/SSG), serta panel admin interaktif untuk pengurus.
- **Keputusan**: Menggunakan Next.js App Router dengan pemisahan route groups:
  - `(public)/` : Rute publik dengan header/footer dan rendering SSR/ISR yang dioptimasi untuk kecepatan & SEO.
  - `admin/(panel)/` : Area terproteksi yang mensyaratkan autentikasi sesi dan RBAC.
- **Konsekuensi**: Kode backend dan frontend berada dalam satu codebase (monorepo terintegrasi), memudahkan pemeliharaan tipe TypeScript ujung ke ujung.

---

## ADR 002: Prisma ORM sebagai Lapisan Akses Basis Data
- **Status**: Accepted
- **Konteks**: Skema relasional yang terstruktur (user, period, department, member, post, opportunity, audit_log).
- **Keputusan**: Menggunakan Prisma ORM (`prisma/schema.prisma`) sebagai single source of truth skema database, mendukung PostgreSQL dan MySQL.
- **Konsekuensi**: Type safety penuh saat query database dan proses migrasi terotomatisasi melalui Prisma CLI.

---

## ADR 003: Sentralisasi Izin Melalui Fungsi Tunggal `can()`
- **Status**: Accepted
- **Konteks**: Akses hak istimewa (RBAC) rentan inkonsisten bila diperiksa secara terpencar di setiap komponen atau rute.
- **Keputusan**: Semua pengecekan izin HANYA melalui modul `src/lib/permissions.ts` dengan signature:
  `can(user, action, resource): boolean`
  Tidak diperbolehkan melakukan *hardcoded role check* (`user.role === 'admin'`) langsung di komponen atau server actions tanpa melewati `can()`.
- **Konsekuensi**: Aturan izin dapat diaudit dan diperbarui di satu titik terpusat.

---

## ADR 004: Penyimpanan Media Multi-Driver (Local & S3/R2)
- **Status**: Accepted
- **Konteks**: Sistem perlu fleksibel dijalankan di server mandiri (VPS dengan penyimpanan disk lokal) maupun skala cloud (Cloudflare R2 / AWS S3).
- **Keputusan**: Mengabstraksikan operasi file melalui interface `StorageDriver` (`src/lib/storage/index.ts`) yang berganti otomatis berdasarkan variabel `STORAGE_DRIVER`.
- **Konsekuensi**: Kode aplikasi tidak bergantung pada satu penyedia infrastruktur cloud.

---

## ADR 005: Status Keaktifan Peluang (Opportunities) Dihitung Dinamis
- **Status**: Accepted
- **Konteks**: Peluang lomba, beasiswa, dan seminar memiliki batas waktu pendaftaran (`deadline_at`). Jika mengandalkan flag boolean statis di database, admin harus menutupnya secara manual saat tenggat lewat.
- **Keputusan**: Status `is_open` dihitung secara dinamis dari perbandingan waktu `deadline_at >= NOW() (WITA)`, diimplementasikan di `src/features/opportunities/status.ts`.
- **Konsekuensi**: Status selalu akurat tanpa memerlukan cron job pembaruan status harian.

---

## ADR 006: Zona Waktu Standar WITA (UTC+8)
- **Status**: Accepted
- **Konteks**: Universitas Muslim Indonesia berlokasi di Makassar, Sulawesi Selatan (Waktu Indonesia Tengah).
- **Keputusan**: Semua representasi tanggal dan waktu pada tampilan pengguna dan pelaporan menggunakan format bahasa Indonesia dengan zona waktu WITA (`Asia/Makassar`).
- **Konsekuensi**: Menghindari kebingungan tenggat waktu lomba atau waktu publikasi berita antara pengurus dan mahasiswa.

---

## ADR 007: Basis Data Terpadu PSDM (SQLite & Turso) & Schema Guard
- **Status**: Accepted
- **Konteks**: Website profil publik harus menggunakan basis data yang sama dengan sistem PSDM (berkas `psdm-db.db` atau klaster Turso LibSQL). Website tidak boleh merusak, mengubah tipe, menghapus, atau memicu migrasi destruktif pada tabel bawaan PSDM (`users`, `departments`, dll).
- **Keputusan**:
  1. Semua tabel baru khusus website menggunakan awalan `web_` (contoh: `web_posts`, `web_work_programs`, `web_opportunities`).
  2. Prisma digunakan sebagai query client via adapter `@prisma/adapter-better-sqlite3` dan `@prisma/adapter-libsql`.
  3. Dilarang menjalankan `prisma migrate dev` atau `db push` destruktif. Seluruh perubahan skema dikawal oleh `node db/guard.mjs` dan skrip SQL aditif di `db/migrations/`.
- **Konsekuensi**: Data fungsionaris PSDM terlindungi secara mutlak (read-only dari sisi CMS publik) tanpa risiko kehilangan data saat pembaruan fitur website.
 
---
 
## ADR 008: Skema Komprehensif 2026/2027 (M_* & T_*) dengan Autentikasi Berbasis PRN
- **Status**: Accepted
- **Konteks**: Organisasi UKM PERISAI UMI membutuhkan standarisasi data menyeluruh yang mencakup data akademik fungsionaris (NIM, Fakultas, Jurusan, TTL), media sosial, hobi, peran fungsionaris per periode aktif, program kerja, keuangan, publikasi berita, dan akun login menggunakan Nomor Registrasi Perisai (PRN).
- **Keputusan**:
  1. Menerapkan konvensi tabel 21 relasional:
     - Tabel Master (`M_*`): `M_Fakultas`, `M_Jurusan`, `M_Departemen`, `M_Jabatan`, `M_Periode`, `M_Role`, `M_Anggota`, `M_Akun`.
     - Tabel Transaksi (`T_*`): `T_Sesi`, `T_Kepengurusan`, `T_Proker`, `T_Berita`, `T_Kompetisi`, `T_Prestasi`, `T_Keuangan`, `T_Galeri`, `T_Pesan_Masuk`, `T_Statistik`, `T_Pengaturan`, `T_Audit_Log`, `T_Media`.
  2. Menggunakan `id_perisai` (PRN) sebagai ID primer pada `M_Anggota` dan username unik pada `M_Akun`.
  3. Menggunakan default password hash SHA-256 (`perisai2026`) untuk kemudahan aktivasi awal oleh fungsionaris baru.
  4. Menyinkronkan model ke Prisma ORM (`prisma/schema.prisma`) dan menghubungkan query publik profil organisasi langsung ke `T_Kepengurusan`.
- **Konsekuensi**: Arsitektur data menjadi sangat modular, mudah diserah-terimakan ke divisi PSDM, dan siap untuk ekspansi sistem keanggotaan jangka panjang.

