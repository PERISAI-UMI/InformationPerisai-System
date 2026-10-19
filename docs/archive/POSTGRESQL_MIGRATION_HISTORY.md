# [ARSIP HISTORIS] Riwayat Migrasi dari PostgreSQL ke SQLite & Turso LibSQL

> [!WARNING]
> **DOKUMEN INI TELAH DIARSIPKAN SEBAGAI CATATAN HISTORIS (HISTORICAL RECORD).**
> Basis data PostgreSQL tidak lagi digunakan dan tidak didukung dalam arsitektur sistem UKM PERISAI UMI saat ini.
> Arsitektur basis data resmi yang aktif adalah:
> - **Lingkungan Lokal**: SQLite 3 (`better-sqlite3`, berkas `psdm-db.db`).
> - **Lingkungan Produksi**: Turso Cloud LibSQL (`@libsql/client` di atas Cloudflare Workers Edge).

---

## 1. Latar Belakang Desain Awal
Pada awal perencanaan sistem InformationPerisai-System (sebelum Oktober 2026), PostgreSQL sempat diusulkan sebagai alternatif database relasional terpusat menggunakan model deployment VPS konvensional.

Namun, dalam proses audit arsitektur dan penyesuaian kebutuhan riil UKM PERISAI UMI, ditemukan beberapa kendala fundamental:
1. **Penyelarasan dengan Database PSDM**:
   Sistem PSDM internal organisasi telah berjalan secara stabil menggunakan SQLite (`psdm-db.db`). Menggunakan PostgreSQL untuk website publik akan menciptakan pemisahan data (*data silo*), menyulitkan sinkronisasi keanggotaan fungsionaris, dan menambah beban pemeliharaan database server.
2. **Kesesuaian Cloudflare Workers (Edge Computing)**:
   Target deployment produksi diputuskan menggunakan Cloudflare Workers (via OpenNext / `@opennextjs/cloudflare`). PostgreSQL berbasis koneksi TCP stateful (`node:net` / `pg` pool) memiliki *connection overhead* dan latensi cold-start tinggi di lingkungan serverless edge isolate.
3. **Efisiensi Sumber Daya**:
   Sebagai organisasi kemahasiswaan riset, mempertahankan server database PostgreSQL berbayar yang aktif 24/7 tidak efisien dibandingkan arsitektur serverless LibSQL yang *scale-to-zero* dan terdistribusi.

---

## 2. Keputusan Arsitektur Definitif (ADR 007 & ADR 008)
Berdasarkan evaluasi tersebut, diputuskan secara resmi:
1. **SQLite 3 (`better-sqlite3`)**:
   Digunakan untuk lingkungan pengembangan (*local development*) dan pengujian (*testing/CI*). Tidak membutuhkan dependensi layanan eksternal atau koneksi internet, sangat cepat, dan menggunakan berkas tunggal `psdm-db.db`.
2. **Turso Cloud LibSQL (`@libsql/client`)**:
   Digunakan untuk lingkungan produksi di Cloudflare Workers. Menggunakan protokol HTTP stateless LibSQL yang sangat optimal untuk edge isolate, dengan replika data di region Tokyo (`aws-ap-northeast-1`) untuk latensi rendah ke Indonesia.
3. **Skema Terpadu 21 Tabel Relasional**:
   Seluruh entitas master data (`M_*`) dan transaksi (`T_*`) dinormalisasi secara penuh, kompatibel 100% antara SQLite lokal dan Turso Cloud.

---

## 3. Kompatibilitas Kode & Perangkat Lunak
- Seluruh modul runtime database diatur melalui `src/lib/db.ts` yang secara dinamis memilih:
  - `@prisma/adapter-libsql` saat `TURSO_DATABASE_URL` tersedia.
  - `@prisma/adapter-better-sqlite3` saat berjalan lokal.
- Kredensial dan script backup PostgreSQL legasi (`pg_dump`, `psql`) telah dipensiunkan dari SOP operasional harian.
