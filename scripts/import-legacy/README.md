# Migrasi Data Legacy Laravel → InformationPerisai-System

Direktori ini berisi skrip sekali pakai (*one-off scripts*) untuk memigrasikan basis data dan berkas media dari sistem lama berbasis Laravel ke arsitektur baru berbasis Next.js & Prisma.

---

## Urutan Eksekusi Migrasi

1. **Persiapan Ekspor**:
   Ikuti panduan di [`01-export-legacy.md`](./01-export-legacy.md) untuk mengekspor tabel-tabel lama ke format JSON atau database sementara.
2. **Impor Data Inti (Core)**:
   ```bash
   npx tsx scripts/import-legacy/02-import-core.ts
   ```
   Mengimpor tabel: `departments`, `periods`, `members`, dan `statistics`.
3. **Impor Konten Organisasi**:
   ```bash
   npx tsx scripts/import-legacy/03-import-content.ts
   ```
   Mengonversi data: `news` → `posts`, `competitions` → `opportunities`, dan `work_programs`.
4. **Impor & Sinkronisasi Media**:
   ```bash
   npx tsx scripts/import-legacy/04-import-media.ts
   ```
   Menyalin aset fisik dari direktori `storage/app/public/` lama ke `public/uploads/` baru dan mencatat baris tabel `media`.
5. **Verifikasi Integritas Data**:
   ```bash
   npx tsx scripts/import-legacy/05-verify.ts
   ```
   Memvalidasi jumlah baris dan integritas relasi antar-tabel baru vs lama.
