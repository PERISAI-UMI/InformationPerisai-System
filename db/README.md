# Dokumentasi Basis Data Terpadu — UKM PERISAI UMI

Direktori ini memuat seluruh skrip DDL, migrasi, dan pengamanan basis data organisasi UKM PERISAI UMI. Sistem ini mendukung **SQLite Lokal (`psdm-db.db`)** dan **Turso Cloud LibSQL**.

---

## 🏛️ Arsitektur 21 Tabel Master & Transaksi

Skema database UKM PERISAI UMI dirancang dengan normalisasi relasional tinggi, memisahkan data referensi master (`M_*`) dan data transaksi/konten operasional (`T_*`):

### 1. Tabel Master (`M_*`)
| Nama Tabel | Deskripsi | Keterangan Kunci |
| :--- | :--- | :--- |
| `M_Fakultas` | Referensi fakultas di Universitas Muslim Indonesia | `id_fakultas` (PK), `nama_fakultas`, `kode_fakultas` |
| `M_Jurusan` | Program studi/jurusan per fakultas | `id_jurusan` (PK), `id_fakultas` (FK), `nama_jurusan`, `jenjang` |
| `M_Departemen` | Divisi/departemen & badan fungsionaris | `id_departemen` (PK), `nama_departemen`, `singkatan`, `slug`, `tupoksi_utama` |
| `M_Jabatan` | Struktur jabatan fungsionaris | `id_jabatan` (PK), `id_departemen` (FK), `nama_jabatan`, `level_hirarki` |
| `M_Periode` | Periode masa bakti kepengurusan | `id_periode` (PK), `nama_periode`, `tahun_mulai`, `tahun_selesai`, `is_active` |
| `M_Role` | Hak akses otorisasi sistem (RBAC) | `id_role` (PK), `nama_role` (`Admin`, `BPH`, `Kadep`, `Staf Ahli`, `Anggota Biasa`) |
| `M_Anggota` | Profil lengkap anggota dan pengurus | `id_perisai` (PK - contoh: `PRN 0238`), `nama_lengkap`, `nim`, `tempat_lahir`, `tanggal_lahir`, `no_wa`, `email`, `linkedin`, `instagram`, `hobi`, `angkatan`, `gen` |
| `M_Akun` | Kredensial autentikasi login fungsionaris | `id_akun` (PK), `id_perisai` (FK/Unique), `id_role` (FK), `password_hash` (SHA-256), `is_active`, `last_login` |

### 2. Tabel Transaksi & Konten (`T_*`)
| Nama Tabel | Deskripsi | Keterangan Kunci |
| :--- | :--- | :--- |
| `T_Sesi` | Penyimpanan sesi aktif dan token cache | `id_sesi` (PK), `id_akun` (FK), `token` (Unique), `expires_at` |
| `T_Kepengurusan` | Pemetaan penugasan anggota di periode aktif | `id_kepengurusan` (PK), `id_periode` (FK), `id_perisai` (FK), `id_jabatan` (FK), `id_departemen` (FK) |
| `T_Proker` | Program kerja tahunan tiap departemen | `id_proker` (PK), `id_departemen` (FK), `id_periode` (FK), `nama_proker`, `slug`, `target_pelaksanaan`, `penanggung_jawab_id` |
| `T_Berita` | Publikasi berita, opini, dan kabar riset | `id_berita` (PK), `id_departemen` (FK), `penulis_id` (FK), `judul`, `slug`, `konten`, `foto_cover`, `status` |
| `T_Kompetisi` | Direktori peluang lomba, riset, dan hibah | `id_kompetisi` (PK), `id_departemen` (FK), `nama_kompetisi`, `slug`, `kategori`, `tingkat`, `deadline_pendaftaran` |
| `T_Prestasi` | Portofolio rekam jejak juara & medali | `id_prestasi` (PK), `id_perisai` (FK), `nama_kompetisi`, `judul_karya`, `peringkat`, `tahun` |
| `T_Keuangan` | Pembukuan kas masuk & kas keluar organisasi | `id_transaksi` (PK), `id_periode` (FK), `jenis_transaksi`, `kategori`, `nominal`, `tanggal_transaksi`, `dicatat_oleh` (FK) |
| `T_Galeri` | Dokumentasi visual kegiatan resmi | `id_galeri` (PK), `judul`, `kategori`, `foto_url`, `tanggal_kegiatan`, `is_featured` |
| `T_Pesan_Masuk` | Kotak masuk formulir kontak publik | `id_pesan` (PK), `nama_pengirim`, `email`, `no_wa`, `subjek`, `isi_pesan`, `is_read` |
| `T_Statistik` | Metrik angka pencapaian portal publik | `id_statistik` (PK), `label`, `nilai`, `urutan`, `is_active` |
| `T_Pengaturan` | Pengaturan konfigurasi sistem (*key-value*) | `kunci` (PK), `nilai`, `tipe`, `diperbarui_oleh` |
| `T_Audit_Log` | Jejak rekam aktivitas dan perubahan data | `id_log` (PK), `id_akun` (FK), `aksi`, `entitas`, `id_entitas`, `ip_address` |
| `T_Media` | Indeks berkas fisik dan media penyimpanan | `id_media` (PK), `nama_berkas`, `kunci_penyimpanan`, `url`, `tipe_mime`, `ukuran_byte` |

---

## 🔑 Kredensial Login Fungsionaris (PRN Based)

Sistem menggunakan nomor registrasi **PRN (ID PERISAI)** sebagai identitas login utama pengurus:
- **Username Login**: Format ID PERISAI (misalnya: `PRN 0238`, `PRN 0241`, `PRN 0253`).
- **Default Password**: `perisai2026` (Dihash menggunakan algoritma aman SHA-256).
- **Pengurus Wajib**: Mengganti kata sandi setelah melakukan login pertama kali di portal fungsionaris.

---

## 👥 Data Kepengurusan Riil Periode 2026–2027

Basis data telah terisi dengan **42 fungsionaris resmi** UKM PERISAI UMI Generasi 11:
1. **Badan Pengurus Harian (BPH)**:
   - Ketua Umum: **Aisyah Ramadhani Muchlis** (`PRN 0238`)
   - Sekretaris Umum: **Baiq Indar Pirayati** (`PRN 0241`)
   - Bendahara Umum: **Muhammad Aidhil Aksan** (`PRN 0250`)
2. **Departemen Riset dan Teknologi**: Muhammad Rifky Saputra Scania (Kadep), Nayla Ananda, Ni'matun Nayiroh, Rizqi Ananda Jalil, A. Nurul Fauziah Az-zahra, Muhammad Adrian, Leon Octa Pratama.
3. **Departemen PSDM**: Muhammad Rafli (Kadep), Surya Putra Jie, Wa Ode Aqilah, Asmalinda Azis.
4. **Departemen Humas**: Risha Dwi Pangestu (Kadep), Achmad Ersyad, La Ode Ahmad Dinajad, Muh Zulkifli Hasril, Aswar Kurniawan, La Ode Muh. Dhefan Kasyfillah, Siti Nur Azizah.
5. **Departemen Media & Informasi**: Nahwa Kaka Saputra Anggareksa (Kadep), Mutia Salianti, Anaway Maryam Tenrisompa, Andi Muhammad Syahrizan, Muh. Fauzan Al Anshari, Putri Ananda Sagita, Nabila Putri Lestari.
6. **Departemen Penalaran dan Keilmuan**: Nur Eka Saputri (Kadep), Anisha Az-Zahrah, Afifa Turrofiah, Elsa Salsabila, Nurfauziah, Muh. Ishak Syam.
7. **Departemen Kompetisi dan Prestasi**: Andi Yusliana (Kadep), A. Aisya Sulistina, Faradilla Ramadania Iski Thalib, Nuratika, Muhammad Aidil, Ainun Nurul Safitri, Fadil Angga Saputra, Hilal S. Ahmad.

---

## 📦 Panduan Pengiriman Basis Data ke PSDM

Untuk menyerahkan database ini kepada tim **PSDM (Pengembangan Sumber Daya Manusia)**:

### 1. Menggunakan File Database SQLite Mandiri
Berkas basis data lengkap telah berada di direktori utama:
- Jalur file: `psdm-db.db`
- Berkas ini siap disalin, dibuka menggunakan kakas SQLite GUI (seperti *DB Browser for SQLite*, *DBeaver*, atau *TablePlus*), atau dipindahkan langsung ke sistem internal PSDM.

### 2. Menggunakan Berkas Migrasi DDL Mentah
Berkas DDL SQL murni tersedia di:
- [`db/migrations/002_complete_perisai_schema.sql`](./migrations/002_complete_perisai_schema.sql)
- Skrip ini kompatibel dengan SQLite 3.35+, Turso LibSQL, dan dapat dengan mudah diadaptasikan ke MySQL / PostgreSQL jika diperlukan.

---

## ⚡ Skrip Operasional Database

```bash
# Seeding data lengkap pengurus 2026/2027 ke SQLite lokal
npx tsx scripts/seed-complete-2026.ts

# Migrasi skema dan seeding ke klaster Turso Cloud
node scripts/migrate-and-seed-turso.mjs

# Perbarui model Prisma ORM
node scripts/update-prisma-schema.js
node ./node_modules/prisma/build/index.js generate

# Pengecekan keamanan skema live terhadap tabel terlindungi
node db/guard.mjs live
```
