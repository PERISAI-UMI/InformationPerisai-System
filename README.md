# InformationPerisai-System — UKM PERISAI UMI

<p align="center">
  <img src="public/logoperisaidengantulisan.png" alt="UKM PERISAI UMI" width="220" />
</p>

<p align="center">
  <strong>Pusat Pengembangan Riset Mahasiswa — Universitas Muslim Indonesia</strong><br />
  Portal Resmi Informasi Publik & Content Management System (CMS) Organisasi
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Database-SQLite%20%7C%20Turso-008080?logo=sqlite" alt="Database" />
  <img src="https://img.shields.io/badge/Deployment-Native%20Systemd%20%2B%20Caddy-green" alt="Deployment" />
</p>

---

## 📌 Ringkasan Proyek

**InformationPerisai-System** adalah platform digital komprehensif untuk **UKM PERISAI UMI** (Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia). Sistem ini dibangun untuk memenuhi dua kebutuhan strategis:

1. **Portal Publik**: Menampilkan profil organisasi, karya ilmiah, liputan kegiatan, publikasi program kerja departemen, direktori kepengurusan, serta peluang lomba/kompetisi akademik secara interaktif dan elegan.
2. **Panel Admin (CMS)**: Menyediakan dashboard internal yang intuitif bagi fungsionaris dan pengurus organisasi untuk mengelola seluruh konten, galeri, statistik, peluang kompetisi, dan pesan masuk tanpa perlu menyentuh kode program.

---

## 🎨 Identitas Visual & Estetika Antarmuka

Website dirancang dengan konsep **Dark Luxury & Scientific Prestige** yang mencerminkan marwah lembaga riset mahasiswa:
- **Warna Utama**: Emas Hangat (`#FFB22C`), Emas Lembut (`#FFC85A`).
- **Warna Latar & Permukaan**: Hitam Elegan (`#1b1b1f`), Abu-abu Permukaan Kaca (`#2b2b31`).
- **Desain Imersif**: Bebas scrollbar visual bawaan peramban (*no scrollbar, pure edge-to-edge flow*), efek glow celestial keemasan, konstelasi bintang interaktif, dan looping marquee tanpa henti.
- **Responsif Penuh**: Tata letak desktop yang lapang (~skala 120%) bersanding dengan antarmuka mobile yang rapi, ergonomis, dan terpusat (*center-aligned*).

---

## 🚀 Fitur Utama

### 1. Portal Publik (`/`)
- **Hero Section Dinamis**: Headline riset universitas, maskot resmi fungsionaris (tampil di desktop, adaptif di mobile), serta tombol aksi cepat.
- **Video Profile Interaktif**: Showcase video profil resmi organisasi terintegrasi YouTube.
- **Showcase Program Kerja**: Tab dan poster visual interaktif memuat program kerja unggulan di setiap departemen.
- **Statistik & Inovator**: Metrik pencapaian organisasi (prestasi, total alumni, fungsionaris aktif, dan tahun dedikasi).
- **Perisai News (Marquee Loop)**: Liputan berita, agenda, dan artikel ilmiah yang berjalan otomatis dengan animasi putar halus (*hover to pause*).
- **Info Lomba & Kompetisi (Marquee Loop)**: Direktori peluang riset, PKM, inovasi, dan lomba mahasiswa dengan penanda kategori serta tenggat waktu dinamis.
- **Halaman Profil Organisasi (`/tentang`)**: Sejarah pendirian, Visi & Misi, Sumber Daya & Fasilitas, serta Bagan Struktur Kepengurusan.
- **Formulir Kontak & Kemitraan (`/kontak`)**: Saluran komunikasi langsung bagi mahasiswa dan calon mitra kolaborasi.

### 2. Panel Manajemen Internal / CMS (`/admin`)
- **Autentikasi & Sesi Aman**: Pengamanan sesi berbasis cookie HTTP-only dengan perlindungan CSRF dan validasi server-side.
- **Manajemen Berita & Artikel (`/admin/posts`)**: Editor artikel, slug generator otomatis, pemilihan kategori, status draft/published, dan unggah thumbnail.
- **Manajemen Program Kerja (`/admin/work-programs`)**: Pengelolaan program tahunan berdasarkan departemen dan periode kepengurusan.
- **Manajemen Peluang / Lomba (`/admin/opportunities`)**: Publikasi kompetisi dan beasiswa dengan kalkulasi otomatis status `is_open` berdasarkan tenggat waktu WITA.
- **Manajemen Fungsionaris & Anggota (`/admin/members`)**: Pencatatan struktur pengurus per periode lengkap dengan foto dan jabatan.
- **Manajemen Periode Kepengurusan (`/admin/periods`)**: Kontrol transisi periode aktif organisasi.
- **Galeri Dokumentasi Kegiatan (`/admin/gallery`)**: Penyimpanan dan pengarsipan dokumentasi visual kegiatan riset.
- **Statistik Organisasi (`/admin/statistics`)**: Pembaruan angka metrik pencapaian yang tampil di halaman depan.
- **Kotak Masuk Pesan (`/admin/inbox`)**: Manajemen pesan dari formulir kontak publik lengkap dengan penanda status dibaca/dibalas.
- **Audit Logging Terpusat (`/admin/audit-log`)**: Jejak rekam aktivitas setiap pengurus dalam mengubah data.
- **Manajemen Pengguna & Hak Akses (`/admin/users`)**: Pemberian hak akses CMS (`super_admin`, `editor`) bagi fungsionaris.

### 3. Keamanan & Integritas Basis Data Terpadu (Dual SQLite & Turso Cloud)
- **Berbagi Basis Data dengan PSDM**: Sistem ini terhubung langsung ke basis data organisasi yang sama dengan sistem PSDM (`psdm-db.db` lokal atau klaster Turso Cloud LibSQL).
- **Skema Komprehensif 21 Tabel (`M_*` & `T_*`)**: Seluruh master referensi data akademik/organisasi dan transaksi dipetakan ke 21 tabel terstandarisasi:
  - **Tabel Master (`M_*`)**: `M_Fakultas`, `M_Jurusan`, `M_Departemen`, `M_Jabatan`, `M_Periode`, `M_Role`, `M_Anggota`, `M_Akun`.
  - **Tabel Transaksi & Konten (`T_*`)**: `T_Sesi`, `T_Kepengurusan`, `T_Proker`, `T_Berita`, `T_Kompetisi`, `T_Prestasi`, `T_Keuangan`, `T_Galeri`, `T_Pesan_Masuk`, `T_Statistik`, `T_Pengaturan`, `T_Audit_Log`, `T_Media`.
- **Kepengurusan Riil Periode 2026–2027**: 42 fungsionaris aktif (BPH dan 6 departemen) terdata lengkap di `M_Anggota` dan `T_Kepengurusan`, tersinkronisasi langsung ke tampilan publik profil organisasi.
- **Autentikasi Berbasis PRN (ID PERISAI)**: Seluruh pengurus memiliki akun di `M_Akun` dengan username menggunakan nomor registrasi anggota (contoh: `PRN 0238`) dan password default terenkripsi SHA-256 (`perisai2026`).
- **Tabel PSDM Terlindungi (Read-Only)**: Tabel bawaan PSDM terdahulu (`users`, `departments`, dll.) tetap dilindungi dan tidak boleh diubah secara destruktif.
- **Schema Safety Guard (`db/guard.mjs`)**: Sistem pencegah eksekusi SQL destruktif (`DROP TABLE`, `DROP COLUMN`, `ALTER TABLE` non-website).

---

## 🛠️ Tech Stack & Ekosistem

| Lapisan | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | React 19, Server Components, Server Actions |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) | Strict mode, End-to-end type safety |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS3 | Utility-first CSS, CSS Keyframes animation, Custom Design System |
| **ORM & Database** | [Prisma 7](https://www.prisma.io/) + SQLite / Turso | Driver `@prisma/adapter-better-sqlite3` dan `@prisma/adapter-libsql` |
| **Validasi** | [Zod v4](https://zod.dev/) | Skema validasi runtime pada form & server actions |
| **Otorisasi (RBAC)** | Centralized `can()` helper | Pengecekan hak akses terpusat di `src/lib/permissions.ts` |
| **Penyimpanan Media**| Multi-Driver Storage | Mendukung disk lokal (`public/uploads`) & Cloudflare R2 / S3 |
| **Infrastruktur** | Native Linux (Ubuntu LTS) | Systemd Service, Caddy Reverse Proxy, Cloudflare CDN (Tanpa Docker) |

---

## 📋 Prasyarat Sistem

Sebelum memasang dan menjalankan proyek secara lokal, pastikan telah terinstal:
- **Node.js**: Versi `>= 20.x` (disarankan Node.js 20 LTS atau 22 LTS)
- **Package Manager**: `npm` (bawaan Node.js) atau `pnpm`
- **Git**: Untuk manajemen versi repositori
- **Kompilator Native C++** *(khusus Windows/Linux untuk build better-sqlite3 jika diperlukan)*

---

## 🚀 Panduan Memulai Cepat (Local Setup)

### 1. Kloning Repositori
```bash
git clone https://github.com/PERISAI-UMI/InformationPerisai-System.git
cd InformationPerisai-System
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (.env)
Salin berkas template lingkungan ke `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi pada file `.env`. Untuk pengembangan lokal menggunakan basis data SQLite:
```env
# Database SQLite Lokal (file psdm-db.db di root proyek)
DATABASE_URL="file:./psdm-db.db"

# Kunci Rahasia Sesi (Generate string acak aman)
AUTH_SECRET="ganti-dengan-string-rahasia-panjang-dan-acak-32-karakter"

# Driver Penyimpanan Media (local atau s3)
STORAGE_DRIVER="local"

# URL Publik Aplikasi
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Catatan Penggunaan Turso Cloud:** Jika menggunakan database Turso yang terdistribusi, tambahkan variabel:
> ```env
> TURSO_DATABASE_URL="libsql://your-db.turso.io"
> TURSO_AUTH_TOKEN="your-turso-auth-token"
> ```

### 4. Eksekusi Migrasi & Sinkronisasi Database
Eksekusi migrasi skema 21 tabel dan pembaruan Prisma Client:
```bash
# 1. Jalankan skrip seeding data pengurus 2026/2027 ke SQLite lokal
npx tsx scripts/seed-complete-2026.ts

# 2. (Opsional) Sinkronkan migrasi dan data ke Turso Cloud LibSQL
node scripts/migrate-and-seed-turso.mjs

# 3. Perbarui Prisma schema dan client
node scripts/update-prisma-schema.js
node ./node_modules/prisma/build/index.js generate
```

### 5. Jalankan Development Server
```bash
npm run dev
```

Buka peramban Anda dan kunjungi:
- **Portal Publik**: [http://localhost:3000](http://localhost:3000)
- **Struktur Organisasi 2026/2027**: [http://localhost:3000/tentang/struktur](http://localhost:3000/tentang/struktur)
- **Panel Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📜 Daftar Perintah (Available Scripts)

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Next.js development server pada port 3000 |
| `npm run build` | Melakukan kompilasi dan optimasi bundel produksi Next.js |
| `npm run start` | Menjalankan server aplikasi Next.js dalam mode produksi |
| `npm run lint` | Menjalankan audit kualitas kode menggunakan ESLint |
| `npm test` | Menjalankan seluruh rangkaian automated unit tests |
| `node ./node_modules/prisma/build/index.js generate` | Menghasilkan TypeScript client Prisma dengan 21 model terbaru |
| `npx tsx scripts/seed-complete-2026.ts` | Mengisi data 42 pengurus 2026/2027 ke SQLite lokal `psdm-db.db` |
| `node scripts/migrate-and-seed-turso.mjs` | Menjalankan migrasi DDL dan seeding data pengurus ke Turso Cloud |
| `node db/guard.mjs live` | Memeriksa integritas tabel terlindungi PSDM pada database live |
| `node db/guard.mjs sql <path>` | Memeriksa apakah file SQL aman dan tidak melanggar aturan proteksi |

---

## 📂 Struktur Direktori Proyek

```plaintext
InformationPerisai-System/
├── db/                         # Skrip keamanan basis data dan migrasi aditif
│   ├── guard.mjs               # Validator pengawal skema (mencegah modifikasi destruktif)
│   ├── README.md               # Dokumentasi lengkap kamus data 21 tabel & SOP PSDM
│   ├── migrations/             # Berkas SQL skema DDL
│   │   ├── 001_create_web_tables.sql       # Skema web_* transisional
│   │   └── 002_complete_perisai_schema.sql # Skema 21 tabel komprehensif (M_* & T_*)
│   └── protected-schema...     # Snapshot tabel terlindungi milik PSDM
├── deploy/                     # Konfigurasi deployment server mandiri (VPS)
│   ├── backup.sh               # Skrip backup otomatis berkala (SQLite / Postgres)
│   ├── Caddyfile               # Konfigurasi reverse proxy Caddy (HTTPS otomatis)
│   ├── deploy.sh               # Skrip pembaruan aplikasi satu perintah
│   ├── perisai-umi.service     # Unit file Systemd untuk auto-restart aplikasi
│   └── README.md               # Panduan setup VPS dari nol
├── docs/                       # Dokumentasi arsitektur dan spesifikasi resmi
│   ├── decisions.md            # Architecture Decision Records (ADR 001 - ADR 008)
│   ├── operations.md           # SOP Backup, Restore, dan Serah-Terima Kepengurusan
│   └── perisai-umi-spec.json   # Single Source of Truth spesifikasi sistem
├── prisma/                     # Konfigurasi Prisma ORM
│   ├── schema.prisma           # Pemetaan skema 21 tabel relasional M_* dan T_*
│   └── seed.ts                 # Skrip seed awal akun super admin
├── public/                     # Aset statis publik (gambar, logo, ikon, font)
├── scripts/                    # Skrip migrasi, seeding, dan otomasi
│   ├── seed-complete-2026.ts       # Seeding data 42 pengurus 2026/2027 ke SQLite
│   ├── migrate-and-seed-turso.mjs  # Migrasi DDL & seeding ke Turso Cloud LibSQL
│   ├── update-prisma-schema.js     # Generator sinkronisasi model Prisma
│   └── import-legacy/              # Panduan dan skrip impor data dari Laravel
├── src/                        # Kode sumber aplikasi utama
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Rute publik (Beranda, Tentang, Kontak, Lomba, Kabar)
│   │   ├── admin/              # Rute terproteksi Panel CMS Pengurus
│   │   ├── api/                # Endpoint API (Health check, media upload, auth)
│   │   ├── globals.css         # Desain global, Tailwind, dan penyembunyi scrollbar
│   │   └── layout.tsx          # Root HTML layout & font loader
│   ├── components/             # Komponen UI bersama
│   │   ├── common/             # Media picker, pagination, safe HTML
│   │   ├── editor/             # Rich Text Editor konten artikel
│   │   ├── layout/             # Header navbar transparan kaca, Footer resmi
│   │   └── ui/                 # Tombol, badge, dialog modal, input formulir
│   ├── features/               # Modul domain organisasi (Action, Query, Component)
│   │   ├── departments/        # Profil dan deskripsi divisi riset
│   │   ├── gallery/            # Galeri dokumentasi visual
│   │   ├── inbox/              # Pesan masuk formulir kontak
│   │   ├── members/            # Fungsionaris dan anggota kepengurusan (T_Kepengurusan)
│   │   ├── opportunities/      # Lomba, kompetisi, dan peluang riset
│   │   ├── periods/            # Periode kepengurusan tahunan
│   │   ├── posts/              # Artikel, liputan, dan berita organisasi
│   │   ├── statistics/         # Metrik dan statistik pencapaian
│   │   └── users/              # Akun pengurus dan hak akses
│   ├── lib/                    # Utilitas pustaka sistem
│   │   ├── audit.ts            # Perekam riwayat aksi admin
│   │   ├── auth.ts             # Manajemen sesi & enkripsi kredensial
│   │   ├── db.ts               # Inisialisasi Prisma client (SQLite / Turso)
│   │   ├── permissions.ts      # Sentralisasi izin RBAC melalui can()
│   │   ├── storage/            # Multi-driver storage (Local / R2 / S3)
│   │   └── utils.ts            # Formatting tanggal WITA, slugify, pembersih input
│   └── proxy.ts                # Middleware pengarah aset
└── tests/                      # Unit testing (permissions, visibility, slug, status)
```

---

## 🧪 Pengujian Otomatis (Automated Testing)

Sistem dilengkapi dengan unit test terisolasi yang menguji logika bisnis penting:
```bash
npm test
```

Materi pengujian mencakup:
- **`permissions.test.ts`**: Memastikan role `super_admin` dan `editor` hanya dapat mengeksekusi aksi sesuai kewenangannya.
- **`visibility.test.ts`**: Menjamin postingan berstatus *draft* tidak pernah bocor ke publik.
- **`opportunities-status.test.ts`**: Memverifikasi kalkulasi dinamis penutupan otomatis peluang lomba saat batas deadline lewat (zona WITA).
- **`slug.test.ts`**: Memastikan keunikan dan sanitasi karakter URL ramah SEO.

---

## 🌐 Deployment Produksi

Deployment ke server VPS Linux (Ubuntu) dilakukan secara native tanpa container:
1. Ikuti panduan lengkap di [`deploy/README.md`](./deploy/README.md).
2. Konfigurasi `systemd` untuk auto-start layanan: `perisai-umi.service`.
3. Pasang `Caddy` sebagai reverse proxy dengan konfigurasi pada [`deploy/Caddyfile`](./deploy/Caddyfile) untuk HTTPS otomatis.
4. Pasang cron job pencadangan harian menggunakan [`deploy/backup.sh`](./deploy/backup.sh).
5. Untuk pembaruan berkala dari GitHub, jalankan [`deploy/deploy.sh`](./deploy/deploy.sh).

---

## 👥 Kontribusi & Pemeliharaan

1. **Aturan Utama**: Setiap perubahan arsitektur data **WAJIB** mematuhi dokumen spesifikasi [`docs/perisai-umi-spec.json`](./docs/perisai-umi-spec.json) dan catatan keputusan [`docs/decisions.md`](./docs/decisions.md).
2. Dilarang keras melakukan perubahan skema database tanpa melewati verifikasi `db/guard.mjs`.
3. Pastikan `npm run lint` dan `npm test` lolos sebelum melakukan commit dan push ke branch `main`.

---

<p align="center">
  <strong>UKM PERISAI UMI</strong> — Menumbuhkan Nalar, Membina Riset, Mengukir Prestasi.<br />
  Kampus II UMI Makassar, Sulawesi Selatan, Indonesia.
</p>
