# Migrasi Data Legacy Laravel → InformationPerisai-System

Direktori ini berisi panduan dan skrip sekali pakai (*one-off migration scripts*) untuk memindahkan data historis dari portal lama berbasis **PHP 8.2 / Laravel 11** ke arsitektur modern berbasis **Next.js 16 + Prisma + SQLite/Turso**.

---

## ⚠️ Perhatian Keamanan & Skema
 
- Sebelum menjalankan skrip impor, pastikan telah melakukan pencadangan database (`psdm-db.db`).
- Skrip impor ini menyasar pemetaan ke skema relasional 21 tabel baru (`M_*` dan `T_*`) serta tabel kompatibilitas `web_*` secara aditif tanpa merusak struktur bawaan PSDM.
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
   Memetakan dan mengimpor data departemen (`M_Departemen`), periode kepengurusan (`M_Periode`), anggota/fungsionaris (`M_Anggota`, `T_Kepengurusan`), dan angka statistik awal (`T_Statistik`).

3. **Impor Konten Organisasi**:
   ```bash
   npx tsx scripts/import-legacy/03-import-content.ts
   ```
   Mengonversi data konten historis:
   - `news` → `T_Berita` / `web_posts`
   - `competitions` → `T_Kompetisi` / `web_opportunities`
   - `work_programs` → `T_Proker` / `web_work_programs`

4. **Impor & Sinkronisasi Berkas Media**:
   ```bash
   npx tsx scripts/import-legacy/04-import-media.ts
   ```
   Menyalin aset gambar/thumbnail fisik dari direktori lama `storage/app/public/` ke direktori baru `public/uploads/` dan mencatat entri pada tabel `T_Media` / `web_media`.

5. **Verifikasi Integritas Data**:
   ```bash
   npx tsx scripts/import-legacy/05-verify.ts
   ```
   Memvalidasi jumlah baris dan integritas relasi antar-tabel baru vs data lama untuk memastikan tidak ada data yang terlewat.
