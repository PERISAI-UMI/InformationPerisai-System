# Migrasi Data Legacy Laravel → InformationPerisai-System

Direktori ini berisi panduan dan skrip sekali pakai (*one-off migration scripts*) untuk memindahkan data historis dari portal lama berbasis **PHP 8.2 / Laravel 11** ke arsitektur modern berbasis **Next.js 16 + Prisma + SQLite/Turso**.

---

## ⚠️ Perhatian Keamanan (PSDM Safety)

- Sebelum menjalankan skrip impor, pastikan telah melakukan pencadangan database (`psdm-db.db`).
- Skrip impor ini hanya menyasar tabel dengan prefix `web_*` atau melakukan pemetaan referensi yang aman tanpa mengubah struktur tabel bawaan PSDM.
- Jalankan pemeriksaan keamanan skema terlebih dahulu:
  ```bash
  node db/guard.mjs live
  ```

---

## 📋 Urutan Eksekusi Migrasi

1. **Persiapan Ekspor Data Legacy**:
   Ikuti panduan di [`01-export-legacy.md`](./01-export-legacy.md) untuk mengekspor tabel-tabel lama dari database Laravel ke berkas `legacy_export.json`.

2. **Impor Data Inti Organisasi (Core)**:
   ```bash
   npx tsx scripts/import-legacy/02-import-core.ts
   ```
   Memetakan dan mengimpor data departemen, periode kepengurusan, anggota/fungsionaris, dan angka statistik awal.

3. **Impor Konten Organisasi**:
   ```bash
   npx tsx scripts/import-legacy/03-import-content.ts
   ```
   Mengonversi data konten historis:
   - `news` → `web_posts`
   - `competitions` → `web_opportunities`
   - `work_programs` → `web_work_programs`

4. **Impor & Sinkronisasi Berkas Media**:
   ```bash
   npx tsx scripts/import-legacy/04-import-media.ts
   ```
   Menyalin aset gambar/thumbnail fisik dari direktori lama `storage/app/public/` ke direktori baru `public/uploads/` dan mencatat entri pada tabel `web_media`.

5. **Verifikasi Integritas Data**:
   ```bash
   npx tsx scripts/import-legacy/05-verify.ts
   ```
   Memvalidasi jumlah baris dan integritas relasi antar-tabel baru vs data lama untuk memastikan tidak ada data yang terlewat.
