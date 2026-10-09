# InformationPerisai-System — UKM PERISAI UMI

Sistem Informasi dan Portal Resmi **UKM PERISAI UMI** (Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia). Sistem ini mencakup portal publik untuk publikasi karya ilmiah, berita, program kerja, departemen, kepengurusan, peluang lomba/prestasi, serta dashboard manajemen internal organisasi.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: Auth session with Role-Based Access Control (RBAC) via centralized `can()`
- **Storage**: Multi-driver (Local Storage / Cloudflare R2 / S3 compatible)
- **Deployment**: Systemd, Caddy Reverse Proxy / Cloudflare Tunnel

---

## 📋 Prasyarat

Sebelum memulai, pastikan telah terpasang:
- **Node.js** >= 20.x
- **npm** atau **pnpm**
- Database server (PostgreSQL / MySQL)

---

## 🚀 Panduan Setup Proyek

### 1. Salin Berkas Lingkungan (.env)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi koneksi database (`DATABASE_URL`), rahasia otentikasi (`AUTH_SECRET`), dan kredensial awal `SUPERADMIN_*`.

### 2. Instal Dependensi
```bash
npm install
```

### 3. Migrasi & Seed Database
Jalankan migrasi Prisma dan lakukan seeding untuk membuat akun `super_admin` pertama:
```bash
npx prisma migrate dev --name init
npm run seed # atau npx tsx prisma/seed.ts
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Akses sistem di peramban pada [http://localhost:3000](http://localhost:3000):
- **Portal Publik**: `http://localhost:3000/`
- **Panel Admin**: `http://localhost:3000/admin`

---

## 📜 Perintah Tersedia (Available Scripts)

- `npm run dev` : Menjalankan development server lokal.
- `npm run build` : Membangun bundel produksi Next.js.
- `npm run start` : Menjalankan server dalam mode produksi.
- `npm run lint` : Menjalankan pengecekan ESLint.
- `npx prisma studio` : Membuka antarmuka visual data Prisma.
- `npx prisma db seed` : Menjalankan skrip seeding akun super_admin.

---

## 📂 Struktur Repositori & Dokumentasi

- [`docs/perisai-umi-spec.json`](./docs/perisai-umi-spec.json) : Spesifikasi sistem utama (single source of truth).
- [`docs/decisions.md`](./docs/decisions.md) : Catatan arsitektur dan keputusan teknis (ADR).
- [`docs/operations.md`](./docs/operations.md) : Prosedur backup, restore, dan serah terima antar periode kepengurusan.
- [`deploy/`](./deploy/) : Konfigurasi deployment (Systemd unit, Caddyfile, Cloudflare tunnel, skrip otomatisasi).
- [`scripts/import-legacy/`](./scripts/import-legacy/) : Panduan dan skrip migrasi data dari sistem lama Laravel.
- [`src/features/`](./src/features/) : Logika inti per modul organisasi (posts, work-programs, opportunities, members, periods, gallery, inbox, dll).
- [`tests/`](./tests/) : Pengujian unit untuk permissions, visibility publik/draft, deadline opportunity, dan slug generator.
