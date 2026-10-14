# PERISAI UMI — Reverse Engineering & Architecture Audit

> **Tanggal Audit**: 14 Oktober 2026  
> **Auditor**: Antigravity (Principal Software Architect Mode)  
> **Status Proyek**: Aktif (Rebuild dari Laravel 11 → Next.js 16 + TypeScript)

---

## 1. Executive Summary & Tech Stack Overview

### 1.1 Ringkasan Eksekutif

**PERISAI UMI Information System** adalah website profil publik + panel admin (CMS) untuk UKM PERISAI (Pusat Pengembangan Riset Mahasiswa) Universitas Muslim Indonesia. Proyek ini merupakan **migrasi penuh** dari stack lama (`PHP 8.2 / Laravel 11 / Blade`) ke stack modern berbasis JavaScript. Arsitekturnya adalah **Fullstack Monolith** dengan pola **Decoupled CMS**, di mana satu aplikasi Next.js melayani halaman publik SSR dan panel admin sekaligus.

Database **digunakan bersama (shared)** dengan sistem PSDM (absensi & data pengurus), sehingga ada constraint ketat: tabel website harus berawalan `web_*` dan tidak boleh memodifikasi tabel milik PSDM.

### 1.2 Tech Stack Utama

| Lapisan | Teknologi | Versi |
|---|---|---|
| **Runtime** | Node.js | `>= 20` (`.nvmrc` → v20) |
| **Framework** | Next.js (App Router) | `^16.3.8` |
| **Bahasa** | TypeScript (strict) | `^5` |
| **UI / Styling** | React 19 + Tailwind CSS v4 | `react@19.2.8`, `tailwindcss@^4.3.3` |
| **ORM / Query** | Prisma Client + Driver Adapters | `^7.10.0` |
| **Database** | SQLite / Turso (LibSQL) | SQLite 3 / libsql cloud |
| **Edge Deployment** | Cloudflare Workers via OpenNext | `@opennextjs/cloudflare@^1.20.11` |
| **Object Storage** | Cloudflare R2 (S3-compatible) | via `@aws-sdk/client-s3` |
| **Validasi** | Zod | `^4.6.5` |
| **CAPTCHA** | Cloudflare Turnstile | API-based |
| **Linter** | ESLint | `^9` |
| **Test Runner** | tsx (Node built-in test runner) | `^4.19.3` |

### 1.3 Dependency Kunci & Fungsinya

| Package | Fungsi |
|---|---|
| `@prisma/client` | ORM TypeScript — query builder tipe-aman |
| `@prisma/adapter-libsql` | Adapter agar Prisma dapat terhubung ke Turso/LibSQL di edge |
| `@prisma/adapter-better-sqlite3` | Adapter Prisma untuk SQLite lokal (dev offline) |
| `@libsql/client` | LibSQL HTTP/WebSocket client untuk Turso Cloud |
| `better-sqlite3` | SQLite native binding untuk dev lokal |
| `@aws-sdk/client-s3` | SDK AWS S3-compatible, digunakan untuk upload ke Cloudflare R2 |
| `@opennextjs/cloudflare` | Build adapter Next.js → Cloudflare Workers |
| `wrangler` | CLI deploy Cloudflare Workers |
| `zod` | Schema validation & type inference (request body, env vars) |
| `pg` + `@prisma/adapter-pg` | Driver PostgreSQL (tersedia tetapi tidak dipakai produksi—legacy artifact) |

### 1.4 Arsitektur Dasar

```
┌─────────────────────────────────────────────────────────────┐
│              FULLSTACK MONOLITH — Next.js App Router        │
│                                                             │
│  ┌──────────────────┐    ┌────────────────────────────────┐ │
│  │  PUBLIC WEBSITE  │    │      ADMIN CMS PANEL           │ │
│  │  (SSR/ISR)       │    │      (/admin/*)                │ │
│  │  /(public)/      │    │  Auth: Cookie Session          │ │
│  └──────────────────┘    └────────────────────────────────┘ │
│            │                          │                     │
│            └──────────┬───────────────┘                     │
│                       ▼                                     │
│              Next.js Route Handlers (API)                   │
│              /api/auth/*, /api/media, /api/health           │
│                       │                                     │
│               ┌───────▼───────┐                             │
│               │  Prisma ORM   │                             │
│               │  (LibSQL adapter)                           │
│               └───────┬───────┘                             │
└───────────────────────┼─────────────────────────────────────┘
                        ▼
              ┌─────────────────┐        ┌──────────────────┐
              │  Turso (LibSQL) │        │  Cloudflare R2   │
              │  = psdm-db.db   │        │  (Object Storage)│
              └─────────────────┘        └──────────────────┘
```

**Pola**: Fullstack Monolith + Decoupled CMS + Edge-first Deployment.

---

## 2. Directory & Component Mapping

### 2.1 Struktur Direktori Utama

```
InformationPerisai-System/
├── .env.example            # Template environment variables
├── .nvmrc                  # Versi Node.js yang dibutuhkan (v20)
├── AGENTS.md               # Aturan untuk AI coder
├── next.config.ts          # Konfigurasi Next.js (rewrites, redirects, image domains)
├── open-next.config.ts     # Konfigurasi adapter Cloudflare Workers
├── postcss.config.mjs      # PostCSS (untuk Tailwind v4)
├── prisma.config.ts        # Konfigurasi Prisma (datasource fallback ke SQLite lokal)
├── wrangler.jsonc          # Konfigurasi deploy Cloudflare Workers
├── tsconfig.json           # Konfigurasi TypeScript
├── eslint.config.mjs       # Konfigurasi ESLint
│
├── prisma/                 # Prisma schema & seed data
│   ├── schema.prisma       # ⭐ Model data tunggal (16 model, 420 baris)
│   ├── seed.ts             # Data awal (periode aktif + pengaturan situs)
│   └── seed_content.ts     # Data konten lebih lengkap (artikel, galeri, dll.)
│
├── db/                     # Manajemen migrasi manual
│   ├── guard.mjs           # Penjaga skema: cek apakah SQL aman dijalankan
│   ├── migrate-turso.mjs   # Script eksekusi migrasi ke Turso Cloud
│   ├── migrations/
│   │   └── 002_complete_perisai_schema.sql  # SQL migrasi utama
│   ├── protected-schema.snapshot.json       # Snapshot skema PSDM (tabel yang dilindungi)
│   └── README.md           # Panduan penggunaan db/guard.mjs
│
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (public)/       # Route grup: halaman publik (tanpa layout admin)
│   │   │   ├── page.tsx    # Halaman beranda (Home)
│   │   │   ├── kabar/      # Halaman berita/artikel
│   │   │   ├── peluang/    # Halaman kompetisi & peluang
│   │   │   ├── tentang/    # Halaman tentang organisasi
│   │   │   └── kontak/     # Halaman formulir kontak
│   │   ├── admin/          # Route grup: panel admin CMS
│   │   │   ├── login/      # Halaman login admin
│   │   │   └── (panel)/    # Route grup: halaman panel (butuh auth)
│   │   │       ├── page.tsx          # Dashboard admin
│   │   │       ├── posts/            # CRUD berita/artikel
│   │   │       ├── opportunities/    # CRUD kompetisi/peluang
│   │   │       ├── departments/      # CRUD departemen
│   │   │       ├── members/          # Manajemen anggota
│   │   │       ├── work-programs/    # Program kerja (proker)
│   │   │       ├── gallery/          # Manajemen galeri & media
│   │   │       ├── periods/          # Manajemen periode kepengurusan
│   │   │       ├── inbox/            # Pesan masuk (kontak form)
│   │   │       ├── users/            # Manajemen akun CMS
│   │   │       ├── settings/         # Pengaturan situs
│   │   │       ├── statistics/       # Statistik & laporan
│   │   │       └── audit-log/        # Log audit aktivitas
│   │   ├── api/            # REST API Route Handlers
│   │   │   ├── auth/[...all]/route.ts   # Auth: login, logout
│   │   │   ├── media/route.ts           # Upload file media
│   │   │   └── health/                  # Health check endpoint
│   │   ├── layout.tsx      # Root layout (global metadata, font)
│   │   ├── globals.css     # Global CSS + Tailwind base
│   │   ├── robots.ts       # Konfigurasi robots.txt (Next.js API)
│   │   └── sitemap.ts      # Sitemap XML dinamis
│   │
│   ├── components/         # Komponen UI yang dapat digunakan ulang
│   ├── features/           # Modul fitur terorganisasi (14 feature folders)
│   ├── lib/                # Library utilities & integrasi
│   │   ├── auth.ts         # Logika sesi (getSession, cookie management)
│   │   ├── db.ts           # Prisma client singleton (lazy proxy)
│   │   ├── permissions.ts  # RBAC: fungsi can(user, action, resource)
│   │   ├── audit.ts        # Penulis audit log ke T_Audit_Log
│   │   ├── cloudflare.ts   # Purge Cloudflare Cache via API
│   │   ├── env.ts          # Validasi & ekspor environment variables
│   │   ├── images.ts       # Optimasi gambar ke WebP (via sharp)
│   │   ├── mailer.ts       # Abstraksi pengiriman email (SMTP stub)
│   │   ├── rate-limit.ts   # In-memory rate limiter
│   │   ├── sanitize.ts     # Sanitasi HTML (anti-XSS dasar)
│   │   ├── slug.ts         # Generator slug URL
│   │   ├── turnstile.ts    # Verifikasi Cloudflare Turnstile CAPTCHA
│   │   ├── youtube.ts      # YouTube utility (embed URL, thumbnail)
│   │   ├── seo.ts          # Helper generate metadata SEO
│   │   ├── dates.ts        # Format tanggal (unix → string)
│   │   ├── legacy-redirects.ts  # Redirect URL dari sistem Laravel lama
│   │   └── storage/        # Abstraction layer penyimpanan file
│   │       ├── index.ts    # Factory: getStorageDriver() → local | S3/R2
│   │       ├── s3.ts       # Driver: Cloudflare R2 / AWS S3
│   │       └── local.ts    # Driver: disk lokal (/public/uploads)
│   ├── proxy.ts            # Edge-compatible DB proxy untuk Cloudflare Workers
│   └── types/
│       └── index.ts        # Definisi tipe TypeScript global
│
├── scripts/
│   └── test-connections.ts # Script cek konektivitas DB & storage
├── tests/                  # Unit/integration tests (tsx test runner)
├── public/                 # Aset statis (favicon, ikon)
└── deploy/                 # Skrip deploy (shell scripts)
```

### 2.2 Entry Points Aplikasi

| Entry Point | Deskripsi |
|---|---|
| `src/app/layout.tsx` | Root layout SSR — titik masuk utama Next.js App Router |
| `src/app/(public)/page.tsx` | Homepage publik (53 KB — komponen besar) |
| `src/app/admin/login/` | Login page admin |
| `src/app/api/auth/[...all]/route.ts` | API handler autentikasi |
| `.open-next/worker.js` | Entry point Cloudflare Workers setelah build |
| `db/guard.mjs` | CLI tool pengaman migrasi database |

---

## 3. Database Architecture & ERD (Mermaid)

### 3.1 Informasi Database

| Atribut | Detail |
|---|---|
| **Tipe** | SQLite 3 (file) / Turso LibSQL (cloud-hosted SQLite) |
| **File Fisik** | `psdm-db.db` (shared dengan sistem PSDM — tidak di-commit) |
| **Cloud Host** | Turso: `libsql://perisai-dev-psdm.aws-ap-northeast-1.turso.io` |
| **Prisma** | Hanya sebagai **client query builder**, bukan migration manager |
| **Migrasi** | SQL manual di `db/migrations/` dieksekusi via `db/guard.mjs` |
| **ORM Mode** | Driver Adapter Pattern (LibSQL over HTTP/WebSocket di edge) |

#### Konvensi Tabel

- **Tabel PSDM** (dilindungi, read-only): `M_Fakultas`, `M_Jurusan`, `M_Departemen`, `M_Jabatan`, `M_Periode`, `M_Role`, `M_Pembina`, `M_Anggota`, `M_Akun`, `T_Sesi`, `T_Kepengurusan`, `T_Proker`, `T_Berita`, `T_Kompetisi`, `T_Prestasi`, `T_Prestasi_Anggota`, `T_Keuangan`, `T_Pesan_Masuk`, `T_Pengaturan`, `T_Audit_Log`, `T_Media`
- **Konvensi ID**: UUID string (teks) untuk entitas utama; integer autoincrement untuk tabel master PSDM
- **Timestamps**: Unix seconds (integer) — bukan ISO string
- **Booleans**: Integer `0/1`

### 3.2 Katalog Entitas / Tabel

#### Grup 1: Master Data & Referensi (PSDM)

| Tabel (Fisik) | Kolom Kunci | Tipe |
|---|---|---|
| `M_Fakultas` | `id_fakultas` (PK, autoincrement), `nama_fakultas` (unique), `kode_fakultas` | int, str, str? |
| `M_Jurusan` | `id_jurusan` (PK), `id_fakultas` (FK), `nama_jurusan`, `jenjang` | int, int, str, str |
| `M_Departemen` | `id_departemen` (PK), `nama_departemen` (unique), `singkatan`, `slug` (unique), `is_active` | int, str, str, str, int |
| `M_Jabatan` | `id_jabatan` (PK), `id_departemen` (FK?), `nama_jabatan`, `level_hirarki` | int, int?, str, int |
| `M_Periode` | `id_periode` (PK), `nama_periode` (unique), `tahun_mulai`, `tahun_selesai`, `is_active` | int, str, int, int, int |
| `M_Role` | `id_role` (PK), `nama_role` (unique), `label`, `deskripsi` | int, str, str, str? |
| `M_Pembina` | `id_pembina` (PK), `nama`, `gelar`, `jabatan`, `kategori`, `foto_url`, `is_active` | int, str, str?, str, str, str?, int |

#### Grup 2: Keanggotaan & Akun

| Tabel (Fisik) | Kolom Kunci | Tipe |
|---|---|---|
| `M_Anggota` | `id_perisai` (PK, UUID text), `nama_lengkap`, `nim` (unique), `id_jurusan` (FK?), `angkatan`, `gen`, `email` (unique), `no_wa`, `foto_url`, `status` | str, str, str, int?, int, int, str, str?, str?, str |
| `M_Akun` | `id_akun` (PK), `id_perisai` (FK unique), `id_role` (FK), `password_hash`, `is_active`, `last_login` | int, str, int, str, int, int? |
| `T_Sesi` | `id_sesi` (PK, UUID), `id_akun` (FK), `token` (unique), `ip_address`, `user_agent`, `expires_at` | str, int, str, str?, str?, int |

#### Grup 3: Transaksi Kepengurusan

| Tabel (Fisik) | Kolom Kunci | Tipe |
|---|---|---|
| `T_Kepengurusan` | `id_kepengurusan` (PK), `id_periode` (FK), `id_perisai` (FK), `id_jabatan` (FK), `id_departemen` (FK?), `tier`, `status` | int, int, str, int, int?, str, str |
| `T_Proker` | `id_proker` (PK), `id_departemen` (FK), `id_periode` (FK), `nama_proker`, `slug` (unique), `penanggung_jawab_id` (FK?), `foto_cover`, `status` | int, int, int, str, str, str?, str?, str |
| `T_Keuangan` | `id_transaksi` (PK), `id_periode` (FK), `jenis_transaksi`, `kategori`, `nominal`, `tanggal_transaksi`, `bukti_nota`, `dicatat_oleh` (FK?) | int, int, str, str, float, str, str?, str? |

#### Grup 4: Konten Publik

| Tabel (Fisik) | Kolom Kunci | Tipe |
|---|---|---|
| `T_Berita` | `id_berita` (PK), `id_departemen` (FK?), `judul`, `slug` (unique), `kategori`, `konten`, `foto_cover`, `penulis_id` (FK?), `status`, `tanggal_publish`, `is_featured`, `views` | int, int?, str, str, str, str, str?, str?, str, int?, int, int |
| `T_Kompetisi` | `id_kompetisi` (PK), `id_departemen` (FK?), `tipe`, `nama_kompetisi`, `slug` (unique), `tingkat`, `penyelenggara`, `deadline_pendaftaran`, `link_pendaftaran`, `status` | int, int?, str, str, str, str, str, int?, str?, str |
| `T_Prestasi` | `id_prestasi` (PK), `id_perisai` (FK), `nama_kompetisi`, `judul_karya`, `tingkat`, `peringkat`, `tahun`, `foto_dokumentasi` | int, str, str, str?, str, str, int, str? |
| `T_Prestasi_Anggota` | `id_prestasi_anggota` (PK), `id_prestasi` (FK), `id_perisai` (FK?), `nama_anggota`, `peran` | int, int, str?, str, str |

#### Grup 5: Sistem, Pesan & Log

| Tabel (Fisik) | Kolom Kunci | Tipe |
|---|---|---|
| `T_Pesan_Masuk` | `id_pesan` (PK), `nama_pengirim`, `email`, `no_wa`, `instansi`, `tujuan`, `subjek`, `isi_pesan`, `is_read`, `ip_address` | int, str, str, str?, str?, str, str, str, int, str? |
| `T_Pengaturan` | `kunci` (PK, string), `nilai`, `tipe`, `diperbarui_oleh` | str, str?, str, str? |
| `T_Audit_Log` | `id_log` (PK), `id_akun`, `aksi`, `entitas`, `id_entitas`, `data_lama`, `data_baru`, `ip_address` | int, int?, str, str, str?, str?, str?, str? |
| `T_Media` | `id_media` (PK, UUID str), `nama_berkas`, `kunci_penyimpanan` (unique), `url`, `tipe_mime`, `ukuran_byte`, `lebar`, `tinggi`, `diunggah_oleh` | str, str, str, str, str, int, int?, int?, str? |

### 3.3 ERD (Mermaid)

```mermaid
erDiagram
    M_Fakultas {
        int id_fakultas PK
        string nama_fakultas
        string kode_fakultas
    }
    M_Jurusan {
        int id_jurusan PK
        int id_fakultas FK
        string nama_jurusan
        string jenjang
    }
    M_Departemen {
        int id_departemen PK
        string nama_departemen
        string singkatan
        string slug
        int is_active
    }
    M_Jabatan {
        int id_jabatan PK
        int id_departemen FK
        string nama_jabatan
        int level_hirarki
    }
    M_Periode {
        int id_periode PK
        string nama_periode
        int tahun_mulai
        int tahun_selesai
        int is_active
    }
    M_Role {
        int id_role PK
        string nama_role
        string label
    }
    M_Pembina {
        int id_pembina PK
        string nama
        string jabatan
        string kategori
        int is_active
    }
    M_Anggota {
        string id_perisai PK
        string nama_lengkap
        string nim
        int id_jurusan FK
        int angkatan
        string email
        string status
    }
    M_Akun {
        int id_akun PK
        string id_perisai FK
        int id_role FK
        string password_hash
        int is_active
    }
    T_Sesi {
        string id_sesi PK
        int id_akun FK
        string token
        int expires_at
    }
    T_Kepengurusan {
        int id_kepengurusan PK
        int id_periode FK
        string id_perisai FK
        int id_jabatan FK
        int id_departemen FK
        string tier
        string status
    }
    T_Proker {
        int id_proker PK
        int id_departemen FK
        int id_periode FK
        string nama_proker
        string slug
        string penanggung_jawab_id FK
        string status
    }
    T_Berita {
        int id_berita PK
        int id_departemen FK
        string judul
        string slug
        string konten
        string penulis_id FK
        string status
        int is_featured
        int views
    }
    T_Kompetisi {
        int id_kompetisi PK
        int id_departemen FK
        string nama_kompetisi
        string slug
        string tingkat
        string status
    }
    T_Prestasi {
        int id_prestasi PK
        string id_perisai FK
        string nama_kompetisi
        string tingkat
        string peringkat
        int tahun
    }
    T_Prestasi_Anggota {
        int id_prestasi_anggota PK
        int id_prestasi FK
        string id_perisai FK
        string nama_anggota
        string peran
    }
    T_Keuangan {
        int id_transaksi PK
        int id_periode FK
        string jenis_transaksi
        float nominal
        string dicatat_oleh FK
    }
    T_Pesan_Masuk {
        int id_pesan PK
        string nama_pengirim
        string email
        string subjek
        string isi_pesan
        int is_read
    }
    T_Pengaturan {
        string kunci PK
        string nilai
        string tipe
    }
    T_Audit_Log {
        int id_log PK
        int id_akun
        string aksi
        string entitas
    }
    T_Media {
        string id_media PK
        string kunci_penyimpanan
        string url
        string tipe_mime
        int ukuran_byte
    }

    M_Fakultas ||--o{ M_Jurusan : "memiliki"
    M_Jurusan ||--o{ M_Anggota : "tempat studi"
    M_Anggota ||--o| M_Akun : "memiliki akun"
    M_Akun }o--|| M_Role : "memiliki role"
    M_Akun ||--o{ T_Sesi : "membuka sesi"
    M_Anggota ||--o{ T_Kepengurusan : "menjabat"
    M_Periode ||--o{ T_Kepengurusan : "mencakup"
    M_Jabatan ||--o{ T_Kepengurusan : "diisi"
    M_Departemen ||--o{ T_Kepengurusan : "menaungi"
    M_Departemen ||--o{ T_Proker : "memiliki proker"
    M_Periode ||--o{ T_Proker : "direncanakan dalam"
    M_Anggota ||--o{ T_Proker : "bertanggung jawab"
    M_Departemen ||--o{ T_Berita : "menerbitkan"
    M_Anggota ||--o{ T_Berita : "menulis"
    M_Departemen ||--o{ T_Kompetisi : "mengelola"
    M_Jabatan }o--|| M_Departemen : "berada di"
    M_Anggota ||--o{ T_Prestasi : "meraih"
    T_Prestasi ||--o{ T_Prestasi_Anggota : "dicapai bersama"
    M_Anggota ||--o{ T_Prestasi_Anggota : "terlibat"
    M_Periode ||--o{ T_Keuangan : "periode transaksi"
    M_Anggota ||--o{ T_Keuangan : "mencatat"
```

---

## 4. Object Storage & File Handling

### 4.1 Arsitektur Storage

Sistem menggunakan **Strategy/Driver Pattern** — satu interface `StorageDriver` dengan dua implementasi:

```
src/lib/storage/
├── index.ts   ← Factory: membaca STORAGE_DRIVER env → memilih driver
├── s3.ts      ← Driver: Cloudflare R2 / AWS S3 (default produksi)
└── local.ts   ← Driver: Disk lokal /public/uploads (dev/fallback)
```

### 4.2 Flow Upload Media

```
Client (multipart/form-data)
  │
  ▼
POST /api/media
  │  [1] Cek autentikasi (getSession)
  │  [2] Cek izin: can(user, "create", "gallery")
  │  [3] Baca FormData → File
  │  [4] Jika image → processImage() → konversi ke WebP (max 1920px, q=85)
  │  [5] Buat nama file: {timestamp}-{baseName}.webp
  │  [6] storage.upload(buffer, filename, mimeType)
  │  [7] Simpan record ke T_Media (Prisma)
  ▼
Response: { id, storageKey, url, path }
```

### 4.3 Cloudflare R2 (Driver S3)

| Konfigurasi | Nilai / Env Var |
|---|---|
| **Endpoint** | `R2_ENDPOINT` = `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |
| **Bucket** | `R2_BUCKET` = `perisaiobjectstorage` (nama di produksi) |
| **Access Key** | `R2_ACCESS_KEY_ID` |
| **Secret Key** | `R2_SECRET_ACCESS_KEY` |
| **Public URL** | `R2_PUBLIC_URL` = `https://pub-xxxx.r2.dev` / `https://media.perisai-umi.org` |
| **Region** | `R2_REGION` = `auto` |

**Naming convention key**: `uploads/{timestamp}-{sanitized_baseName}.webp`

**Fallback behaviour**: Jika kredensial R2 tidak tersedia, driver mengembalikan URL representatif lokal `/uploads/{filename}` tanpa error fatal.

### 4.4 Validasi & Batasan File

| Atribut | Detail |
|---|---|
| **Tipe yang didukung** | Semua MIME type; gambar otomatis dikonversi ke WebP |
| **Konversi output** | `image/*` → `image/webp` (via `sharp`, fallback ke buffer asli) |
| **Max width gambar** | 1920px (auto-resize, tanpa enlargement) |
| **Metadata tersimpan** | `kunci_penyimpanan`, `url`, `tipe_mime`, `ukuran_byte`, `lebar`, `tinggi`, `alt_text` |
| **Akses publik** | Direct public URL via R2 public CDN (`r2.dev` / custom domain) |
| **Presigned URL** | Tidak diimplementasikan (semua file bersifat publik) |

---

## 5. API & Authentication Flow

### 5.1 Peta Endpoint

#### API Route Handlers

| Method | Endpoint | Deskripsi | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login admin | ✗ |
| `POST` | `/api/auth/logout` | Logout admin | ✗ |
| `POST` | `/api/media` | Upload file media | ✅ (+ permission gallery) |
| `GET` | `/api/health` | Health check DB & storage | ✗ |

#### Halaman Publik (SSR)

| Route | Deskripsi |
|---|---|
| `/` | Homepage |
| `/kabar` | Daftar berita/kegiatan |
| `/kabar/[slug]` | Detail berita |
| `/peluang` | Daftar kompetisi & peluang |
| `/peluang/[slug]` | Detail kompetisi |
| `/tentang` | Tentang organisasi |
| `/tentang/sumber-daya` | Departemen, proker, galeri |
| `/kontak` | Formulir kontak |

#### Redirect & Rewrite (Legacy Compatibility)

| Source | Destination | Tipe |
|---|---|---|
| `/about` | `/tentang` | Rewrite |
| `/activity` | `/kabar` | Rewrite |
| `/competition` | `/peluang` | Rewrite |
| `/departemen` | `/tentang/sumber-daya#departemen` | Redirect (302) |
| `/program` | `/tentang/sumber-daya#proker` | Redirect (302) |
| `/galeri` | `/tentang/sumber-daya#galeri` | Redirect (302) |

#### Panel Admin (Protected SSR Pages)

| Route | Deskripsi | Role Minimum |
|---|---|---|
| `/admin/login` | Login page | - |
| `/admin` | Dashboard | EDITOR |
| `/admin/posts` | CRUD Berita | EDITOR |
| `/admin/opportunities` | CRUD Kompetisi | EDITOR |
| `/admin/gallery` | Manajemen galeri | EDITOR |
| `/admin/departments` | CRUD Departemen | ADMIN |
| `/admin/members` | Manajemen anggota | ADMIN |
| `/admin/work-programs` | Program kerja | ADMIN |
| `/admin/periods` | Periode kepengurusan | ADMIN |
| `/admin/inbox` | Pesan masuk | ADMIN |
| `/admin/users` | Akun CMS | SUPER_ADMIN |
| `/admin/settings` | Pengaturan situs | SUPER_ADMIN |
| `/admin/statistics` | Statistik | ADMIN |
| `/admin/audit-log` | Log audit | SUPER_ADMIN |

### 5.2 Model Autentikasi & Otorisasi

#### Authentication (Cookie Session — Custom)

Sistem **tidak** menggunakan NextAuth/Auth.js. Autentikasi dibangun **dari scratch** menggunakan:

- **Session identifier**: Cookie `perisai_session_id` berisi `id_perisai` (UUID anggota)
- **Verifikasi password**: Dual-format support:
  1. `scrypt` dengan format `salt:key` (sistem baru)
  2. `SHA-256 hex` (kompatibel dengan seed data lama)
- **Cookie properties**: `httpOnly=true`, `secure=true` (production), `sameSite=lax`, `maxAge=7 hari`
- **Session lookup**: Setiap request melakukan query `M_Anggota` berdasarkan cookie value

> ⚠️ **Catatan arsitektur**: Sesi tidak menggunakan `T_Sesi` untuk lookup (model TSesi ada di skema tapi belum digunakan oleh `getSession()`). Cookie langsung menyimpan `id_perisai` sebagai session identifier.

#### Authorization (RBAC — Custom)

Fungsi `can(user, action, resource)` di `src/lib/permissions.ts`:

```
SUPER_ADMIN → semua aksi & semua resource
ADMIN       → semua, KECUALI:
              - users: create, delete, manage
              - audit_log: selain read
              - settings: manage
EDITOR      → posts, gallery, opportunities: create, read, update
              resource lain: read only
```

### 5.3 Alur End-to-End: Login Admin

```
1. User buka /admin/login → mengisi email/NIM + password
2. Frontend POST /api/auth/login → { email, password }
3. Server: query M_Anggota WHERE email=? OR id_perisai=?
4. Server: verifyPassword(input, storedHash) → scrypt / SHA-256
5. Jika valid: Set-Cookie: perisai_session_id={id_perisai}; HttpOnly
6. Response 200 OK → client redirect ke /admin
```

### 5.4 Alur End-to-End: Upload Media

```
1. Admin di /admin/gallery → pilih file, klik upload
2. Frontend POST /api/media (multipart/form-data, field: "file")
3. Server:
   a. getSession() → validasi cookie
   b. can(user, "create", "gallery") → cek RBAC
   c. file.arrayBuffer() → Buffer
   d. Jika image: processImage() → WebP, max 1920px
   e. storage.upload(buffer, filename) → S3/R2 PUT request
   f. prisma.tMedia.create({ url, mime, size, ... })
4. Response: { id, storageKey, url }
```

---

## 6. External Integrations

| Integrasi | Library / Metode | Tujuan | Status |
|---|---|---|---|
| **Cloudflare R2** | `@aws-sdk/client-s3` | Object Storage untuk file media | ✅ Aktif |
| **Turso / LibSQL** | `@libsql/client` + `@prisma/adapter-libsql` | Database cloud (hosted SQLite) | ✅ Aktif |
| **Cloudflare Workers** | `@opennextjs/cloudflare` + `wrangler` | Deployment platform edge | ✅ Aktif |
| **Cloudflare Turnstile** | Fetch ke `challenges.cloudflare.com` | Anti-bot CAPTCHA untuk formulir kontak | ✅ Implementasi tersedia |
| **Cloudflare Cache Purge** | Fetch ke `api.cloudflare.com` | Purge CDN cache saat konten diperbarui | ✅ Implementasi tersedia |
| **SMTP Email** | `mailer.ts` (stub/placeholder) | Notifikasi pesan masuk | ⚠️ Belum diimplementasi penuh |
| **Sharp** | `import('sharp')` dynamic | Kompresi & konversi gambar ke WebP | ✅ Dynamic import (fallback aman) |
| **YouTube** | `youtube.ts` (URL parser) | Embed thumbnail/URL YouTube ke konten | ✅ Utility tersedia |

---

## 7. Inferred Environment Variables & Local Setup

### 7.1 Daftar Environment Variables

| Variable | Wajib | Default / Contoh | Deskripsi |
|---|---|---|---|
| `NODE_ENV` | ✅ | `development` | Mode runtime |
| `NEXT_PUBLIC_APP_URL` | ✅ | `http://localhost:3000` | URL publik aplikasi |
| `AUTH_SECRET` | ✅ prod | `<random 32 char>` | Secret untuk signing session/cookie |
| **Database** | | | |
| `TURSO_DATABASE_URL` | ✅ cloud | `libsql://xxx.turso.io` | URL Turso database |
| `TURSO_AUTH_TOKEN` | ✅ cloud | `eyJ...` | JWT auth token Turso |
| `DATABASE_URL` | ✅ lokal | `file:./psdm-db.db` | SQLite lokal (dev offline) |
| **Storage** | | | |
| `STORAGE_DRIVER` | ✅ | `r2` / `local` | Driver penyimpanan |
| `R2_ENDPOINT` | ✅ jika r2 | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` | Endpoint R2 |
| `R2_BUCKET` | ✅ jika r2 | `perisai-media` | Nama bucket R2 |
| `R2_ACCESS_KEY_ID` | ✅ jika r2 | — | R2 Access Key |
| `R2_SECRET_ACCESS_KEY` | ✅ jika r2 | — | R2 Secret Key |
| `R2_PUBLIC_URL` | ✅ jika r2 | `https://media.perisai-umi.org` | URL publik CDN media |
| `R2_REGION` | ➖ | `auto` | Region R2 |
| **Cloudflare** | | | |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ➖ | — | Turnstile site key (public) |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | ➖ | — | Turnstile secret (server-side) |
| `CLOUDFLARE_ZONE_ID` | ➖ | — | Zone ID untuk cache purge |
| `CLOUDFLARE_API_TOKEN` | ➖ | — | API Token untuk cache purge |
| **Email** | | | |
| `SMTP_HOST` | ➖ | — | Host SMTP |
| `SMTP_USER` | ➖ | — | Username SMTP |
| `SMTP_PASSWORD` | ➖ | — | Password SMTP |

### 7.2 Local Setup Guide

#### Prasyarat

- Node.js **v20** (gunakan `nvm use` atau install dari `.nvmrc`)
- npm atau yarn
- File database SQLite `psdm-db.db` (diperoleh dari admin PSDM — **tidak di-commit**)

#### Langkah 1: Clone & Install

```bash
git clone <repo-url>
cd InformationPerisai-System
npm install
```

#### Langkah 2: Konfigurasi Environment

```bash
cp .env.example .env
```

**Untuk development offline (SQLite lokal):**
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=isi-minimal-32-karakter-acak-di-sini
DATABASE_URL=file:./psdm-db.db
STORAGE_DRIVER=local
```

#### Langkah 3: Generate Prisma Client

```bash
npx prisma generate
```

#### Langkah 4: Jalankan Migrasi Database

```bash
# JANGAN gunakan prisma migrate dev/reset!
# Cek keamanan SQL sebelum dieksekusi:
node db/guard.mjs sql db/migrations/002_complete_perisai_schema.sql

# Eksekusi ke Turso Cloud:
node db/migrate-turso.mjs db/migrations/002_complete_perisai_schema.sql

# Atau ke SQLite lokal:
sqlite3 psdm-db.db < db/migrations/002_complete_perisai_schema.sql
```

#### Langkah 5: Seed Data Awal

```bash
npx tsx prisma/seed.ts
# Opsional — seed konten lengkap:
npx tsx prisma/seed_content.ts
```

#### Langkah 6: Jalankan Dev Server

```bash
npm run dev
# → http://localhost:3000
```

#### Build Produksi (Cloudflare Workers)

```bash
npm run build      # Build + generate Prisma client
npx wrangler deploy
```

---

## 8. Technical Debt, Security Risks & Modernization Roadmap

### 8.1 🔴 Risiko Keamanan Kritis

#### 1. Kredensial Hardcoded di Source Code

> **Severity: CRITICAL**

File `src/lib/db.ts` (baris 9-10) dan `wrangler.jsonc` mengandung **Turso JWT token**, **Cloudflare R2 access/secret key**, dan **AUTH_SECRET** dalam plaintext yang di-commit ke repository:

- Turso JWT auth token (full read-write access ke database produksi)
- R2 Access Key ID + Secret Access Key (akses penuh ke bucket media)
- AUTH_SECRET (digunakan untuk signing sesi)

**Tindakan segera yang diperlukan:**
1. Rotasi **semua** credentials yang terekspos
2. Hapus hardcoded values dari `db.ts`
3. Pindahkan secrets ke Cloudflare Secrets via `wrangler secret put`
4. Tambahkan `wrangler.jsonc` ke `.gitignore` atau buat versi `.example`

#### 2. Session Cookie Menyimpan Identifier Langsung (Insecure Session Design)

> **Severity: HIGH**

Cookie `perisai_session_id` menyimpan `id_perisai` (UUID anggota) secara langsung tanpa signature. Seorang attacker yang mengetahui `id_perisai` seorang admin dapat memalsukan cookie dan mendapatkan akses penuh. Tabel `T_Sesi` ada di skema tapi **tidak digunakan** untuk validasi.

**Rekomendasi:**
- Ganti cookie value ke opaque random token (32+ byte)
- Aktifkan lookup via `T_Sesi` (verifikasi token + expires_at server-side)

#### 3. Sanitasi HTML Tidak Memadai (XSS Risk)

> **Severity: MEDIUM**

`sanitize.ts` menggunakan regex sederhana yang tidak mencakup semua XSS vector modern seperti `<svg onload>`, `<img onerror>`, CSS expression, dll.

**Rekomendasi:** Gunakan `sanitize-html` atau `DOMPurify` (dengan JSDOM untuk server-side).

#### 4. Rate Limiting In-Memory Tidak Efektif di Edge

> **Severity: MEDIUM**

`rate-limit.ts` menggunakan `Map` in-memory. Di Cloudflare Workers, setiap request bisa ke instance berbeda, sehingga rate limit tidak bekerja global — brute-force login tidak terlindungi secara efektif.

**Rekomendasi:** Gunakan Cloudflare Rate Limiting Rules (level CDN) atau Cloudflare KV untuk shared counter.

#### 5. Session Expiry Tidak Divalidasi Server-side

> **Severity: MEDIUM**

`getSession()` tidak memeriksa `T_Sesi.expires_at`. Validitas session sepenuhnya bergantung pada `maxAge` cookie browser — tidak ada invalidasi server-side (mis. setelah logout paksa).

### 8.2 ⚠️ Utang Teknis

| Item | Lokasi | Deskripsi |
|---|---|---|
| **Mailer tidak fungsional** | `src/lib/mailer.ts` | Hanya mock console.log — SMTP tidak diimplementasi |
| **`pg` driver tidak digunakan** | `package.json` | `pg` dan `@prisma/adapter-pg` terpasang tapi tidak terpakai — sisa dari iterasi awal |
| **`emnapi` packages** | `package.json` | Dependensi WebAssembly yang kemungkinan tidak diperlukan |
| **Homepage oversized** | `src/app/(public)/page.tsx` | 53 KB dalam satu file — perlu dipecah ke sub-komponen |
| **Seed model mismatch** | `prisma/seed.ts` | Mengakses `prisma.period` & `prisma.setting` yang tidak ada di `schema.prisma` saat ini |
| **T_Sesi tidak digunakan** | `src/lib/auth.ts` | Model ada di skema tapi session tidak validasi via tabel ini |
| **`any` type casting** | `src/lib/db.ts:53` | `(client as any)[prop]` melanggar TypeScript strict rules |

### 8.3 🚀 Roadmap Modernisasi Prioritas

#### Prioritas 1 — Keamanan (Segera, Sebelum Production)
1. **Rotasi semua credentials** yang terekspos di `db.ts` dan `wrangler.jsonc`
2. **Refaktor sistem sesi** — opaque random token + validasi via `T_Sesi`
3. **Ganti sanitasi HTML** ke `sanitize-html` library
4. **Pindahkan secrets** ke Cloudflare Secrets (`wrangler secret put`)

#### Prioritas 2 — Stabilitas (1-2 sprint)
5. **Implementasi SMTP** menggunakan Resend API atau nodemailer
6. **Rate limiting yang efektif** via Cloudflare KV atau native CF Rate Limiting
7. **Bersihkan dependencies** tak terpakai (`pg`, `@prisma/adapter-pg`, emnapi)
8. **Fix seed.ts** — selaraskan nama model dengan `schema.prisma`

#### Prioritas 3 — Kualitas Kode (Ongoing)
9. **Pecah homepage** `page.tsx` (53 KB) ke komponen terpisah
10. **Hapus `any` casting** di `db.ts`
11. **Lengkapi test coverage** — terutama untuk auth flow dan permission matrix
12. **Tambahkan `wrangler.jsonc`** ke `.gitignore` / buat versi `.example`

---

*Laporan ini dihasilkan melalui static code analysis terhadap seluruh source code pada 14 Oktober 2026. Validasi runtime diperlukan untuk memastikan behaviour aktual di lingkungan produksi.*
