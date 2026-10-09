-- ==============================================================================
-- UNIFIED DATABASE MIGRATION — UKM PERISAI UMI
-- File: 002_complete_perisai_schema.sql
-- Single Source of Truth Skema Basis Data Organisasi & Portal Web
-- Menyatukan seluruh entitas master (M_*), transaksi (T_*), dan modul operasional web
-- ==============================================================================

-- ========================================================
-- BAGIAN 1: TABEL MASTER DATA & REFERENSI AKADEMIK (M_*)
-- ========================================================

-- 1. Master Fakultas di Lingkungan Universitas Muslim Indonesia
CREATE TABLE IF NOT EXISTS M_Fakultas (
  id_fakultas INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_fakultas TEXT NOT NULL UNIQUE,
  kode_fakultas TEXT UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 2. Master Jurusan / Program Studi per Fakultas
CREATE TABLE IF NOT EXISTS M_Jurusan (
  id_jurusan INTEGER PRIMARY KEY AUTOINCREMENT,
  id_fakultas INTEGER NOT NULL REFERENCES M_Fakultas(id_fakultas) ON DELETE CASCADE,
  nama_jurusan TEXT NOT NULL,
  jenjang TEXT NOT NULL DEFAULT 'S1', -- S1, S2, D3, Profesi
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 3. Master Departemen & Badan Fungsionaris Organisasi
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
  nama_role TEXT NOT NULL UNIQUE, -- SUPER_ADMIN, BPH, KADEP, EDITOR, ANGGOTA
  label TEXT NOT NULL,
  deskripsi TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 7. Master Dewan Pembina, Penasihat, dan Alumni Kehormatan (Penggabungan dari 001 web_extra_people)
CREATE TABLE IF NOT EXISTS M_Pembina (
  id_pembina INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  gelar TEXT,
  jabatan TEXT NOT NULL, -- Dewan Pembina, Dewan Penasihat, Pembina Teknis, dll.
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

-- 8. Master Anggota & Fungsionaris (Identitas Lengkap Mahasiswa & PRN)
CREATE TABLE IF NOT EXISTS M_Anggota (
  id_perisai TEXT PRIMARY KEY, -- Format ID PERISAI: PRN XXXX
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

-- 9. Master Akun Login Fungsionaris (Username Menggunakan PRN)
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

-- 11. Pemetaan Struktur Fungsionaris per Periode Aktif
CREATE TABLE IF NOT EXISTS T_Kepengurusan (
  id_kepengurusan INTEGER PRIMARY KEY AUTOINCREMENT,
  id_periode INTEGER NOT NULL REFERENCES M_Periode(id_periode) ON DELETE CASCADE,
  id_perisai TEXT NOT NULL REFERENCES M_Anggota(id_perisai) ON DELETE CASCADE,
  id_jabatan INTEGER NOT NULL REFERENCES M_Jabatan(id_jabatan) ON DELETE RESTRICT,
  id_departemen INTEGER REFERENCES M_Departemen(id_departemen) ON DELETE SET NULL,
  tier TEXT NOT NULL DEFAULT 'staf', -- bph, kadep, staf, pembina (dari 001 untuk kemudahan UI)
  status TEXT NOT NULL DEFAULT 'aktif', -- aktif, selesai, cuti
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(id_periode, id_perisai, id_jabatan)
);

-- 12. Program Kerja Departemen per Periode
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
  status TEXT NOT NULL DEFAULT 'rencana', -- rencana, berjalan, terlaksana, evaluasi
  urutan INTEGER NOT NULL DEFAULT 0,
  diperbarui_oleh TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 13. Galeri / Dokumentasi Pelaksanaan Proker (Multi-Foto dari 001 web_work_program_images)
CREATE TABLE IF NOT EXISTS T_Proker_Dokumentasi (
  id_proker_dok INTEGER PRIMARY KEY AUTOINCREMENT,
  id_proker INTEGER NOT NULL REFERENCES T_Proker(id_proker) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  caption TEXT,
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ========================================================
-- BAGIAN 4: KONTEN PUBLIK (BERITA, KOMPETISI, PRESTASI)
-- ========================================================

-- 14. Berita, Opini, dan Artikel Riset
CREATE TABLE IF NOT EXISTS T_Berita (
  id_berita INTEGER PRIMARY KEY AUTOINCREMENT,
  id_departemen INTEGER REFERENCES M_Departemen(id_departemen) ON DELETE SET NULL,
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  kategori TEXT NOT NULL DEFAULT 'berita', -- berita, riset, opini, pengumuman
  ringkasan TEXT,
  konten TEXT NOT NULL,
  foto_cover TEXT,
  penulis_id TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  tanggal_publish INTEGER,
  is_featured INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  diperbarui_oleh TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 15. Multi-Foto Galeri Artikel Berita (dari 001 web_post_images)
CREATE TABLE IF NOT EXISTS T_Berita_Foto (
  id_berita_foto INTEGER PRIMARY KEY AUTOINCREMENT,
  id_berita INTEGER NOT NULL REFERENCES T_Berita(id_berita) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  caption TEXT,
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 16. Direktori Peluang Kompetisi, Beasiswa, & Seminar (dari 001 web_opportunities + 002)
CREATE TABLE IF NOT EXISTS T_Kompetisi (
  id_kompetisi INTEGER PRIMARY KEY AUTOINCREMENT,
  id_departemen INTEGER REFERENCES M_Departemen(id_departemen) ON DELETE SET NULL,
  tipe TEXT NOT NULL DEFAULT 'lomba', -- lomba, beasiswa, seminar, hibah (dari 001 type)
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

-- 17. Portofolio Rekam Jejak Prestasi & Juara Anggota
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
  anggota_tim TEXT,
  foto_dokumentasi TEXT,
  link_sertifikat TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ========================================================
-- BAGIAN 5: KEUANGAN, GALERI, PESAN, DAN PENGATURAN
-- ========================================================

-- 18. Pembukuan Kas Masuk & Kas Keluar Bendahara Umum
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

-- 19. Dokumentasi Visual & Galeri Kegiatan Resmi
CREATE TABLE IF NOT EXISTS T_Galeri (
  id_galeri INTEGER PRIMARY KEY AUTOINCREMENT,
  judul TEXT NOT NULL,
  kategori TEXT NOT NULL DEFAULT 'Kegiatan',
  foto_url TEXT NOT NULL,
  deskripsi TEXT,
  tanggal_kegiatan TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1, -- (dari 001)
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 20. Kotak Masuk Pesan dari Formulir Kontak Publik
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

-- 21. Metrik Angka Statistik & Pencapaian Utama Website
CREATE TABLE IF NOT EXISTS T_Statistik (
  id_statistik INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  nilai TEXT NOT NULL,
  deskripsi TEXT,
  urutan INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 22. Pengaturan Konfigurasi Global Sistem (Key-Value)
CREATE TABLE IF NOT EXISTS T_Pengaturan (
  kunci TEXT PRIMARY KEY,
  nilai TEXT,
  tipe TEXT NOT NULL DEFAULT 'string',
  diperbarui_oleh TEXT REFERENCES M_Anggota(id_perisai) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 23. Jejak Rekam Audit Keamanan & Perubahan Data (Audit Log)
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

-- 24. Manajemen Indeks Aset & Berkas Fisik (Storage Index)
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
-- BAGIAN 6: TABEL PENDUKUNG OPERASIONAL & KOMPATIBILITAS (web_* & core)
-- ========================================================

-- Kompatibilitas Sistem Inti
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS fakultas (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS program_studi (
  id TEXT PRIMARY KEY,
  fakultas_id TEXT NOT NULL REFERENCES fakultas(id) ON DELETE CASCADE,
  nama TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  prn TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  generasi INTEGER NOT NULL,
  department_id TEXT NOT NULL REFERENCES departments(id),
  jabatan TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  tempat_lahir TEXT,
  tanggal_lahir TEXT,
  alamat TEXT,
  no_telp TEXT,
  email TEXT NOT NULL UNIQUE,
  nim TEXT NOT NULL UNIQUE,
  program_studi_id TEXT NOT NULL REFERENCES program_studi(id),
  angkatan INTEGER NOT NULL,
  linkedin_url TEXT,
  instagram_username TEXT,
  avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  deskripsi TEXT,
  start_date INTEGER NOT NULL,
  end_date INTEGER NOT NULL,
  is_published INTEGER NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  mode TEXT NOT NULL,
  lokasi TEXT,
  meeting_url TEXT,
  is_locked INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS attendances (
  id TEXT PRIMARY KEY,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  recorded_by TEXT NOT NULL REFERENCES users(id),
  recorded_at INTEGER NOT NULL,
  UNIQUE(activity_id, user_id)
);

CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  jenis_izin TEXT NOT NULL,
  alasan TEXT NOT NULL,
  evidence_url TEXT,
  status TEXT NOT NULL,
  reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS pj_departments (
  admin_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  assigned_at INTEGER NOT NULL,
  PRIMARY KEY(admin_id, department_id)
);

-- Kompatibilitas CMS Website (web_*)
CREATE TABLE IF NOT EXISTS web_media (
  id TEXT PRIMARY KEY,
  storage_key TEXT NOT NULL UNIQUE,
  original_name TEXT,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_department_profiles (
  department_id TEXT PRIMARY KEY REFERENCES departments(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  vision TEXT,
  mission TEXT,
  group_photo_media_id TEXT REFERENCES web_media(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_user_access (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  cms_role TEXT NOT NULL DEFAULT 'editor',
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_extra_people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'pembina',
  linkedin_url TEXT,
  photo_media_id TEXT REFERENCES web_media(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_posts (
  id TEXT PRIMARY KEY,
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'berita',
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_media_id TEXT REFERENCES web_media(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at INTEGER,
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_post_images (
  post_id TEXT NOT NULL REFERENCES web_posts(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL REFERENCES web_media(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  PRIMARY KEY (post_id, media_id)
);

CREATE TABLE IF NOT EXISTS web_work_programs (
  id TEXT PRIMARY KEY,
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  cover_media_id TEXT REFERENCES web_media(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_work_program_images (
  work_program_id TEXT NOT NULL REFERENCES web_work_programs(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL REFERENCES web_media(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  PRIMARY KEY (work_program_id, media_id)
);

CREATE TABLE IF NOT EXISTS web_opportunities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'lomba',
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  organizer TEXT,
  description TEXT,
  deadline_at INTEGER,
  registration_url TEXT,
  poster_media_id TEXT REFERENCES web_media(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_statistics (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_gallery_items (
  id TEXT PRIMARY KEY,
  media_id TEXT NOT NULL REFERENCES web_media(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  taken_at INTEGER,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_inbox_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  purpose TEXT NOT NULL DEFAULT 'pertanyaan',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  handled_at INTEGER,
  handled_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  ip_hash TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  changes TEXT,
  ip_hash TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS web_periods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date INTEGER NOT NULL,
  end_date INTEGER,
  is_current INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS web_members (
  id TEXT PRIMARY KEY,
  period_id TEXT REFERENCES web_periods(id) ON DELETE RESTRICT,
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'staf',
  linkedin_url TEXT,
  photo_media_id TEXT REFERENCES web_media(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- ========================================================
-- BAGIAN 7: INDEKS KINERJA & PENCARIAN TINGGI
-- ========================================================

-- Indeks Tabel Master & Transaksi (M_* & T_*)
CREATE INDEX IF NOT EXISTS idx_m_anggota_jurusan ON M_Anggota (id_jurusan);
CREATE INDEX IF NOT EXISTS idx_m_anggota_gen ON M_Anggota (gen, angkatan);
CREATE INDEX IF NOT EXISTS idx_m_pembina_kategori ON M_Pembina (kategori, urutan);
CREATE INDEX IF NOT EXISTS idx_t_kepengurusan_periode ON T_Kepengurusan (id_periode, id_departemen, urutan);
CREATE INDEX IF NOT EXISTS idx_t_kepengurusan_tier ON T_Kepengurusan (tier, urutan);
CREATE INDEX IF NOT EXISTS idx_t_proker_periode ON T_Proker (id_periode, id_departemen);
CREATE INDEX IF NOT EXISTS idx_t_proker_slug ON T_Proker (slug);
CREATE INDEX IF NOT EXISTS idx_t_proker_dok ON T_Proker_Dokumentasi (id_proker, urutan);
CREATE INDEX IF NOT EXISTS idx_t_berita_status ON T_Berita (status, tanggal_publish);
CREATE INDEX IF NOT EXISTS idx_t_berita_slug ON T_Berita (slug);
CREATE INDEX IF NOT EXISTS idx_t_berita_foto ON T_Berita_Foto (id_berita, urutan);
CREATE INDEX IF NOT EXISTS idx_t_kompetisi_status ON T_Kompetisi (status, deadline_pendaftaran);
CREATE INDEX IF NOT EXISTS idx_t_kompetisi_slug ON T_Kompetisi (slug);
CREATE INDEX IF NOT EXISTS idx_t_prestasi_anggota ON T_Prestasi (id_perisai, tahun);
CREATE INDEX IF NOT EXISTS idx_t_keuangan_periode ON T_Keuangan (id_periode, jenis_transaksi);
CREATE INDEX IF NOT EXISTS idx_t_pesan_masuk_read ON T_Pesan_Masuk (is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_t_galeri_status ON T_Galeri (is_active, is_featured, urutan);

-- Indeks Tabel Kompatibilitas (web_*)
CREATE INDEX IF NOT EXISTS idx_web_posts_status ON web_posts (status, published_at);
CREATE INDEX IF NOT EXISTS idx_web_posts_slug ON web_posts (slug);
CREATE INDEX IF NOT EXISTS idx_web_work_programs_dept ON web_work_programs (department_id);
CREATE INDEX IF NOT EXISTS idx_web_opportunities_status ON web_opportunities (status, deadline_at);
CREATE INDEX IF NOT EXISTS idx_web_gallery_items_active ON web_gallery_items (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_web_inbox_messages_read ON web_inbox_messages (is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_web_members_period ON web_members (period_id, tier, sort_order);
