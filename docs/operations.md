# Panduan Operasional Sistem — UKM PERISAI UMI

Dokumen ini berisi Standard Operating Procedure (SOP) untuk pemeliharaan, pencadangan (backup), pemulihan data (restore), serta serah-terima sistem antarkepengurusan UKM PERISAI UMI.

---

## 1. Cadangan Data Terjadwal (Backup)

### Basis Data
Sistem dilengkapi dengan skrip cadangan otomatis di `deploy/backup.sh`.
Skrip mencadangkan database secara berkala (cron) ke direktori `/var/backups/perisai-umi/` atau penyimpanan terpisah.

**Menjalankan backup manual:**
```bash
bash deploy/backup.sh
```

**Jadwal Cron Rekomendasi (Setiap hari pukul 02:00 WITA):**
```bash
0 2 * * * /bin/bash /opt/perisai-umi/deploy/backup.sh >> /var/log/perisai-backup.log 2>&1
```

### Media dan Berkas Unggahan
- Jika menggunakan penyimpanan **Lokal**: sinkronkan folder `public/uploads/` atau direktori storage lokal ke penyimpanan sekunder (misal menggunakan `rsync` mingguan).
- Jika menggunakan **Cloudflare R2**: data media telah terisolasi dan memiliki replikasi bawaan.

---

## 2. Pemulihan Data (Restore)

### Memulihkan Basis Data (Restore)
1. Hentikan layanan web untuk mencegah konflik akses berkas:
   ```bash
   sudo systemctl stop perisai-umi
   ```
2. Pulihkan berkas database cadangan:
   - **SQLite (`psdm-db.db`)**:
     ```bash
     gunzip -c /var/backups/perisai-umi/psdm_sqlite_YYYYMMDD_HHMMSS.db.gz > /opt/perisai-umi/psdm-db.db
     sudo chown perisai:perisai /opt/perisai-umi/psdm-db.db
     chmod 660 /opt/perisai-umi/psdm-db.db
     ```
   - **Turso Cloud**:
     Gunakan fitur point-in-time recovery atau impor via Turso CLI:
     ```bash
     turso db create <new-db-name> --from-dump <backup-file.sql>
     ```
   - **PostgreSQL (opsional jika aktif)**:
     ```bash
     gunzip -c /var/backups/perisai-umi/pg_backup_YYYYMMDD_HHMMSS.sql.gz | psql -U $DB_USER -d $DB_NAME
     ```
3. Verifikasi skema dengan guard sebelum menjalankan kembali sistem:
   ```bash
   node db/guard.mjs live
   ```
4. Mulai kembali layanan:
   ```bash
   sudo systemctl start perisai-umi
   ```

---

## 3. SOP Serah-Terima Antar-Periode Kepengurusan

Setiap pergantian periode kepengurusan UKM PERISAI UMI, tim IT/Media wajib melakukan langkah-langkah berikut:

### Langkah 1: Buat Periode Baru
1. Masuk ke panel admin (`/admin/periods`).
2. Klik tombol **Tambah Periode Baru**.
3. Masukkan nama periode (contoh: `2025/2026`), visi, misi, dan tanggal mulai.
4. Aktifkan saklar **Set sebagai Periode Aktif** (sistem otomatis menonaktifkan status aktif pada periode sebelumnya).

### Langkah 2: Manajemen Akun Pengurus Baru
1. Super Admin membuat atau mengaktifkan akun untuk Ketua Umum, Sekretaris Umum, dan Koordinator Departemen baru di menu `/admin/users`.
2. Ubah role pengurus demisioner menjadi `editor` atau nonaktifkan status akun jika sudah lulus.
3. Lakukan pergantian kata sandi Super Admin utama dan simpan di brankas password organisasi (misal Bitwarden/KeePass).

### Langkah 3: Impor Struktur Organisasi
1. Input data anggota dan koordinator pada menu `/admin/members` di bawah periode baru.
2. Unggah foto resmi pengurus terbaru.

---

## 4. Monitoring & Pemeriksaan Kesehatan
Sistem menyediakan endpoint cek kesehatan di:
- `GET /api/health`
Mengembalikan status konektivitas database dan status layanan.
Endpoint ini digunakan oleh uptime monitor (misal UptimeKuma / BetterUptime).

---

## 5. SOP Penyerahan Basis Data ke Tim PSDM

Untuk menyerahkan database ke divisi PSDM:
1. **Pemeriksaan Integritas Lokal**:
   Pastikan file database `psdm-db.db` memiliki seluruh data terbaru (42 fungsionaris):
   ```bash
   node db/guard.mjs live
   ```
2. **Kompilasi Berkas Serah-Terima**:
   Serahkan dua berkas utama kepada koordinator PSDM:
   - `psdm-db.db` : Berkas database SQLite siap pakai.
   - `db/migrations/002_complete_perisai_schema.sql` : Skrip DDL skema 21 tabel.
   - `db/README.md` : Panduan kamus data dan struktur tabel.
3. **Aktivasi Akun Fungsionaris Baru**:
   - Berikan daftar PRN (ID PERISAI) kepada masing-masing anggota.
   - Beritahukan kata sandi default `perisai2026` dan instruksikan untuk menggantinya pada saat pertama kali login.

