-- ==============================================================================
-- UNIFIED & NORMALIZED DATABASE SCHEMA — UKM PERISAI UMI
-- File: 002_complete_perisai_schema.sql
-- Single Source of Truth Skema Basis Data Organisasi & Portal Web
-- Menerapkan Normalisasi Penuh (1NF, 2NF, 3NF) pada 25 Tabel Master & Transaksi
-- Kompatibilitas Sistem & Web diimplementasikan via Zero-Storage SQL Views & Triggers
-- ==============================================================================

-- ========================================================
-- BAGIAN 1: TABEL MASTER DATA & REFERENSI AKADEMIK (M_*)
-- ========================================================

-- 1. Master Fakultas di Lingkungan Universitas Muslim Indonesia (3NF)
CREATE TABLE IF NOT EXISTS M_Fakultas (
  id_fakultas INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_fakultas TEXT NOT NULL UNIQUE,
  kode_fakultas TEXT UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 2. Master Jurusan / Program Studi per Fakultas (3NF: Relasi hierarki ke M_Fakultas)
CREATE TABLE IF NOT EXISTS M_Jurusan (
  id_jurusan INTEGER PRIMARY KEY AUTOINCREMENT,
  id_fakultas INTEGER NOT NULL REFERENCES M_Fakultas(id_fakultas) ON DELETE CASCADE,
  nama_jurusan TEXT NOT NULL,
  jenjang TEXT NOT NULL DEFAULT 'S1', -- S1, S2, D3, Profesi
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 3. Master Departemen & Badan Fungsionaris Organisasi (3NF: Seluruh atribut divisi terpadu)
CREATE TABLE IF NOT EXISTS M_Departemen (
  id_departemen INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_departemen TEXT NOT NULL UNIQUE,
  singkatan TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  tupoksi_utama TEXT,
  deskripsi_singkat TEXT,
  visi TEXT,
  misi TEXT,
  foto_grup TEXT,
  urutan INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 4. Master Jabatan Fungsionaris & Level Hirarki
CREATE TABLE IF NOT EXISTS M_Jabatan (
  id_jabatan INTEGER PRIMARY KEY AUTOINCREMENT,
  id_departemen INTEGER REFERENCES M_Departemen(id_departemen) ON DELETE SET NULL,
  nama_jabatan TEXT NOT NULL,
  level_hirarki INTEGER NOT NULL DEFAULT 5, -- 1=Ketum, 2=Sekum/Bendum, 3=Kadep, 4=Staf Ahli, 5=Anggota
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 5. Master Periode Kepengurusan Tahunan
CREATE TABLE IF NOT EXISTS M_Periode (
  id_periode INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_periode TEXT NOT NULL UNIQUE, -- Contoh: 2026/2027
  tahun_mulai INTEGER NOT NULL,
  tahun_selesai INTEGER NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0,
  tema_kepengurusan TEXT,
  visi TEXT,
  misi TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 6. Master Role Akses Keamanan (RBAC)
CREATE TABLE IF NOT EXISTS M_Role (
  id_role INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_role TEXT NOT NULL UNIQUE, -- SUPER_ADMIN, ADMIN, KADEP, EDITOR, ANGGOTA
  label TEXT NOT NULL,
  deskripsi TEXT,
  permissions TEXT DEFAULT '[]',
  is_system INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 7. Master Dewan Pembina, Penasihat, dan Alumni Kehormatan
CREATE TABLE IF NOT EXISTS M_Pembina (
  id_pembina INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  gelar TEXT,
  jabatan TEXT NOT NULL, -- Dewan Pembina, Dewan Penasihat, dll.
  kategori TEXT NOT NULL DEFAULT 'pembina', -- pembina, penasihat, alumni_kehormatan
  foto_url TEXT,
  linkedin TEXT,
  urutan INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ========================================================
-- BAGIAN 2: DATA KEANGGOTAAN & AKUN FUNGSIONARIS
-- ========================================================

-- 8. Master Anggota & Fungsionaris (Identitas Mahasiswa & PRN) (3NF: Relasi ke M_Jurusan tanpa redundansi fakultas)
CREATE TABLE IF NOT EXISTS M_Anggota (
  id_perisai TEXT PRIMARY KEY, -- Format ID PERISAI: PRNXXXX (Tanpa spasi, contoh: PRN0238 sebagai Username Login)
  nama_lengkap TEXT NOT NULL,
  nim TEXT NOT NULL UNIQUE,
  id_jurusan INTEGER REFERENCES M_Jurusan(id_jurusan) ON DELETE SET NULL,
  angkatan INTEGER NOT NULL,
  gen INTEGER NOT NULL, -- Generasi Anggota (10, 11, dst.)
  tempat_lahir TEXT,
  tanggal_lahir TEXT, -- Format: YYYY-MM-DD
  jenis_kelamin TEXT DEFAULT 'L', -- L / P
  email TEXT NOT NULL UNIQUE,
  no_wa TEXT,
  alamat TEXT,
  linkedin TEXT,
  instagram TEXT,
  hobi TEXT,
  quotes TEXT,
  foto_url TEXT,
  status TEXT NOT NULL DEFAULT 'aktif', -- aktif, demisioner, alumni, cuti
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 9. Master Akun Login Fungsionaris (Dipisahkan dari biodata untuk kepatuhan 3NF & Keamanan)
CREATE TABLE IF NOT EXISTS M_Akun (
  id_akun INTEGER PRIMARY KEY AUTOINCREMENT,
  id_perisai TEXT NOT NULL UNIQUE REFERENCES M_Anggota(id_perisai) ON DELETE CASCADE,
  id_role INTEGER NOT NULL REFERENCES M_Role(id_role) ON DELETE RESTRICT,
  password_hash TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 10. Sesi Login & Token Autentikasi Pengguna
CREATE TABLE IF NOT EXISTS T_Sesi (
  id_sesi TEXT PRIMARY KEY,
  id_akun INTEGER NOT NULL REFERENCES M_Akun(id_akun) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  payload TEXT,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ========================================================
-- BAGIAN 3: TRANSAKSI KEPENGURUSAN & PROGRAM KERJA
-- ========================================================

-- 11. Pemetaan Struktur Fungsionaris per Periode Aktif (Junction Table 4-Arah Ternormalisasi 3NF)
CREATE TABLE IF NOT EXISTS T_Kepengurusan (
  id_kepengurusan INTEGER PRIMARY KEY AUTOINCREMENT,
  id_periode INTEGER NOT NULL REFERENCES M_Periode(id_periode) ON DELETE CASCADE,
  id_perisai TEXT NOT NULL REFERENCES M_Anggota(id_perisai) ON DELETE CASCADE,
  id_jabatan INTEGER NOT NULL REFERENCES M_Jabatan(id_jabatan) ON DELETE RESTRICT,
  id_departemen INTEGER REFERENCES M_Departemen(id_departemen) ON DELETE SET NULL,
  tier TEXT NOT NULL DEFAULT 'staf', -- inti, kadep, staf
  status TEXT NOT NULL DEFAULT 'aktif', -- aktif, selesai, cuti
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(id_periode, id_perisai, id_jabatan)
);

-- 12. Program Kerja Departemen per Periode (T_Proker_Dokumentasi digabung ke kolom foto_dokumentasi)
CREATE TABLE IF NOT EXISTS T_Proker (
  id_proker INTEGER PRIMARY KEY AUTOINCREMENT,
  id_departemen INTEGER NOT NULL REFERENCES M_Departemen(id_departemen) ON DELETE CASCADE,
  id_periode INTEGER NOT NULL REFERENCES M_Periode(id_periode) ON DELETE CASCADE,
  nama_proker TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  deskripsi TEXT,
  target_pelaksanaan TEXT,
  indikator_keberhasilan TEXT,
  penanggung_jawab_id TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  foto_cover TEXT,
  foto_dokumentasi TEXT, -- Foto dokumentasi kegiatan proker (JSON Array / multi-url)
  status TEXT NOT NULL DEFAULT 'rencana', -- rencana, berjalan, terlaksana, evaluasi
  urutan INTEGER NOT NULL DEFAULT 0,
  diperbarui_oleh TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ========================================================
-- BAGIAN 4: KONTEN PUBLIK (BERITA, KOMPETISI, PRESTASI)
-- ========================================================

-- 13. Berita, Opini, dan Artikel Riset (T_Berita_Foto digabung ke kolom foto_dokumentasi)
CREATE TABLE IF NOT EXISTS T_Berita (
  id_berita INTEGER PRIMARY KEY AUTOINCREMENT,
  id_departemen INTEGER REFERENCES M_Departemen(id_departemen) ON DELETE SET NULL,
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  kategori TEXT NOT NULL DEFAULT 'berita', -- berita, riset, opini, pengumuman
  ringkasan TEXT,
  konten TEXT NOT NULL,
  foto_cover TEXT,
  foto_dokumentasi TEXT, -- Foto galeri dokumentasi berita (JSON Array / multi-url)
  penulis_id TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  tanggal_publish INTEGER,
  is_featured INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  diperbarui_oleh TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 16. Direktori Peluang Kompetisi, Beasiswa, & Seminar
CREATE TABLE IF NOT EXISTS T_Kompetisi (
  id_kompetisi INTEGER PRIMARY KEY AUTOINCREMENT,
  id_departemen INTEGER REFERENCES M_Departemen(id_departemen) ON DELETE SET NULL,
  tipe TEXT NOT NULL DEFAULT 'lomba', -- lomba, beasiswa, seminar, hibah
  nama_kompetisi TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  kategori TEXT NOT NULL DEFAULT 'KTI', -- PKM, KTI, Inovasi, Desain, Debat, Bisnis
  tingkat TEXT NOT NULL DEFAULT 'Nasional', -- Universitas, Regional, Nasional, Internasional
  penyelenggara TEXT NOT NULL,
  deskripsi TEXT,
  deadline_pendaftaran INTEGER, -- Timestamp epoch WITA
  tanggal_pelaksanaan TEXT,
  link_pendaftaran TEXT,
  link_panduan TEXT,
  link_poster TEXT,
  status TEXT NOT NULL DEFAULT 'published', -- draft, published, archived
  tanggal_publish INTEGER,
  views INTEGER NOT NULL DEFAULT 0,
  penulis_id TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  diperbarui_oleh TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 17. Portofolio Rekam Jejak Prestasi & Juara Anggota (Ternormalisasi 1NF & 2NF)
CREATE TABLE IF NOT EXISTS T_Prestasi (
  id_prestasi INTEGER PRIMARY KEY AUTOINCREMENT,
  id_perisai TEXT NOT NULL REFERENCES M_Anggota(id_perisai) ON DELETE CASCADE,
  nama_kompetisi TEXT NOT NULL,
  judul_karya TEXT,
  kategori TEXT,
  tingkat TEXT NOT NULL DEFAULT 'Nasional',
  peringkat TEXT NOT NULL, -- Juara 1, Juara 2, Medali Emas, Best Paper, Finalis
  tahun INTEGER NOT NULL,
  penyelenggara TEXT,
  foto_dokumentasi TEXT,
  link_sertifikat TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 18. Normalisasi 1NF & 2NF: Detail Anggota Tim Prestasi (Memecah multivalued attribute anggota_tim)
CREATE TABLE IF NOT EXISTS T_Prestasi_Anggota (
  id_prestasi_anggota INTEGER PRIMARY KEY AUTOINCREMENT,
  id_prestasi INTEGER NOT NULL REFERENCES T_Prestasi(id_prestasi) ON DELETE CASCADE,
  id_perisai TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  nama_anggota TEXT NOT NULL,
  peran TEXT NOT NULL DEFAULT 'Anggota', -- Ketua Tim, Anggota
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ========================================================
-- BAGIAN 5: KEUANGAN, PESAN, DAN PENGATURAN
-- (T_Galeri dan T_Statistik dihapus sesuai revisi)
-- ========================================================

-- 17. Pembukuan Kas Masuk & Kas Keluar Bendahara Umum
CREATE TABLE IF NOT EXISTS T_Keuangan (
  id_transaksi INTEGER PRIMARY KEY AUTOINCREMENT,
  id_periode INTEGER NOT NULL REFERENCES M_Periode(id_periode) ON DELETE CASCADE,
  jenis_transaksi TEXT NOT NULL, -- pemasukan, pengeluaran
  kategori TEXT NOT NULL DEFAULT 'Kas Bulanan',
  nominal REAL NOT NULL DEFAULT 0,
  keterangan TEXT NOT NULL,
  tanggal_transaksi TEXT NOT NULL,
  bukti_nota TEXT,
  dicatat_oleh TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 18. Kotak Masuk Pesan dari Formulir Kontak Publik
CREATE TABLE IF NOT EXISTS T_Pesan_Masuk (
  id_pesan INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_pengirim TEXT NOT NULL,
  email TEXT NOT NULL,
  no_wa TEXT,
  instansi TEXT,
  tujuan TEXT NOT NULL DEFAULT 'pertanyaan',
  subjek TEXT NOT NULL,
  isi_pesan TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  dibalas_pada INTEGER,
  dibalas_oleh TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  ip_address TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 19. Pengaturan Konfigurasi Global Sistem (Key-Value)
CREATE TABLE IF NOT EXISTS T_Pengaturan (
  kunci TEXT PRIMARY KEY,
  nilai TEXT,
  tipe TEXT NOT NULL DEFAULT 'string',
  diperbarui_oleh TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 24. Jejak Rekam Audit Keamanan & Perubahan Data (Audit Log)
CREATE TABLE IF NOT EXISTS T_Audit_Log (
  id_log INTEGER PRIMARY KEY AUTOINCREMENT,
  id_akun INTEGER REFERENCES M_Akun(id_akun) ON DELETE SET NULL,
  aksi TEXT NOT NULL,
  entitas TEXT NOT NULL,
  id_entitas TEXT,
  data_lama TEXT,
  data_baru TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 25. Manajemen Indeks Aset & Berkas Fisik (Storage Index)
CREATE TABLE IF NOT EXISTS T_Media (
  id_media TEXT PRIMARY KEY,
  nama_berkas TEXT NOT NULL,
  kunci_penyimpanan TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  tipe_mime TEXT NOT NULL,
  ukuran_byte INTEGER NOT NULL,
  lebar INTEGER,
  tinggi INTEGER,
  alt_text TEXT,
  diunggah_oleh TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ========================================================
-- BAGIAN 6: INDEKS KINERJA & PENCARIAN TINGGI (M_* & T_*)
-- ========================================================

CREATE INDEX IF NOT EXISTS idx_m_anggota_jurusan ON M_Anggota (id_jurusan);
CREATE INDEX IF NOT EXISTS idx_m_anggota_gen ON M_Anggota (gen, angkatan);
CREATE INDEX IF NOT EXISTS idx_m_pembina_kategori ON M_Pembina (kategori, urutan);
CREATE INDEX IF NOT EXISTS idx_t_kepengurusan_periode ON T_Kepengurusan (id_periode, id_departemen, urutan);
CREATE INDEX IF NOT EXISTS idx_t_kepengurusan_tier ON T_Kepengurusan (tier, urutan);
CREATE INDEX IF NOT EXISTS idx_t_proker_periode ON T_Proker (id_periode, id_departemen);
CREATE INDEX IF NOT EXISTS idx_t_proker_slug ON T_Proker (slug);
CREATE INDEX IF NOT EXISTS idx_t_berita_status ON T_Berita (status, tanggal_publish);
CREATE INDEX IF NOT EXISTS idx_t_berita_slug ON T_Berita (slug);
CREATE INDEX IF NOT EXISTS idx_t_kompetisi_status ON T_Kompetisi (status, deadline_pendaftaran);
CREATE INDEX IF NOT EXISTS idx_t_kompetisi_slug ON T_Kompetisi (slug);
CREATE INDEX IF NOT EXISTS idx_t_prestasi_anggota ON T_Prestasi (id_perisai, tahun);
CREATE INDEX IF NOT EXISTS idx_t_prestasi_tim ON T_Prestasi_Anggota (id_prestasi, id_perisai);
CREATE INDEX IF NOT EXISTS idx_t_keuangan_periode ON T_Keuangan (id_periode, jenis_transaksi);
CREATE INDEX IF NOT EXISTS idx_t_pesan_masuk_read ON T_Pesan_Masuk (is_read, created_at);


