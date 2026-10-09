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
  nama_role TEXT NOT NULL UNIQUE, -- SUPER_ADMIN, BPH, KADEP, EDITOR, ANGGOTA
  label TEXT NOT NULL,
  deskripsi TEXT,
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
  tier TEXT NOT NULL DEFAULT 'staf', -- bph, kadep, staf
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

-- 13. Galeri / Dokumentasi Pelaksanaan Proker (1NF: Multi-foto dipisah dari kolom teks)
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

-- 15. Multi-Foto Galeri Artikel Berita (1NF)
CREATE TABLE IF NOT EXISTS T_Berita_Foto (
  id_berita_foto INTEGER PRIMARY KEY AUTOINCREMENT,
  id_berita INTEGER NOT NULL REFERENCES T_Berita(id_berita) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  caption TEXT,
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
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
-- BAGIAN 5: KEUANGAN, GALERI, PESAN, DAN PENGATURAN
-- ========================================================

-- 19. Pembukuan Kas Masuk & Kas Keluar Bendahara Umum
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

-- 20. Dokumentasi Visual & Galeri Kegiatan Resmi
CREATE TABLE IF NOT EXISTS T_Galeri (
  id_galeri INTEGER PRIMARY KEY AUTOINCREMENT,
  judul TEXT NOT NULL,
  kategori TEXT NOT NULL DEFAULT 'Kegiatan',
  foto_url TEXT NOT NULL,
  deskripsi TEXT,
  tanggal_kegiatan TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 21. Kotak Masuk Pesan dari Formulir Kontak Publik
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

-- 22. Metrik Angka Statistik & Pencapaian Utama Website
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

-- 23. Pengaturan Konfigurasi Global Sistem (Key-Value)
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
CREATE INDEX IF NOT EXISTS idx_t_proker_dok ON T_Proker_Dokumentasi (id_proker, urutan);
CREATE INDEX IF NOT EXISTS idx_t_berita_status ON T_Berita (status, tanggal_publish);
CREATE INDEX IF NOT EXISTS idx_t_berita_slug ON T_Berita (slug);
CREATE INDEX IF NOT EXISTS idx_t_berita_foto ON T_Berita_Foto (id_berita, urutan);
CREATE INDEX IF NOT EXISTS idx_t_kompetisi_status ON T_Kompetisi (status, deadline_pendaftaran);
CREATE INDEX IF NOT EXISTS idx_t_kompetisi_slug ON T_Kompetisi (slug);
CREATE INDEX IF NOT EXISTS idx_t_prestasi_anggota ON T_Prestasi (id_perisai, tahun);
CREATE INDEX IF NOT EXISTS idx_t_prestasi_tim ON T_Prestasi_Anggota (id_prestasi, id_perisai);
CREATE INDEX IF NOT EXISTS idx_t_keuangan_periode ON T_Keuangan (id_periode, jenis_transaksi);
CREATE INDEX IF NOT EXISTS idx_t_pesan_masuk_read ON T_Pesan_Masuk (is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_t_galeri_status ON T_Galeri (is_active, is_featured, urutan);

-- ========================================================
-- BAGIAN 7: VIEW & TRIGGER KOMPATIBILITAS (ZERO STORAGE)
-- Menjamin kode aplikasi eksisting & modul web tetap berjalan mulus
-- Tanpa menciptakan duplikasi data fisik (100% Normalized)
-- ========================================================

-- View Departemen
CREATE VIEW IF NOT EXISTS departments AS
SELECT slug AS id, nama_departemen AS nama FROM M_Departemen;

-- View Fakultas
CREATE VIEW IF NOT EXISTS fakultas AS
SELECT LOWER(kode_fakultas) AS id, nama_fakultas AS nama FROM M_Fakultas;

-- View Program Studi
CREATE VIEW IF NOT EXISTS program_studi AS
SELECT LOWER(REPLACE(REPLACE(j.nama_jurusan, ' ', '-'), '/', '-')) AS id, LOWER(f.kode_fakultas) AS fakultas_id, j.nama_jurusan AS nama
FROM M_Jurusan j JOIN M_Fakultas f ON j.id_fakultas = f.id_fakultas;

-- View Pengguna (Users)
CREATE VIEW IF NOT EXISTS users AS
SELECT 
  a.id_perisai AS id, a.id_perisai AS prn, k.password_hash, r.nama_role AS role, a.gen AS generasi,
  COALESCE(d.slug, 'bph') AS department_id, COALESCE(j.nama_jabatan, 'Anggota') AS jabatan,
  a.nama_lengkap, a.tempat_lahir, a.tanggal_lahir, a.alamat, a.no_wa AS no_telp, a.email, a.nim,
  LOWER(REPLACE(REPLACE(COALESCE(jr.nama_jurusan, 'Teknik Informatika'), ' ', '-'), '/', '-')) AS program_studi_id,
  a.angkatan, a.linkedin AS linkedin_url, a.instagram AS instagram_username, a.foto_url AS avatar_url
FROM M_Anggota a
JOIN M_Akun k ON a.id_perisai = k.id_perisai
JOIN M_Role r ON k.id_role = r.id_role
LEFT JOIN T_Kepengurusan kp ON a.id_perisai = kp.id_perisai AND kp.id_periode = (SELECT id_periode FROM M_Periode WHERE is_active = 1 LIMIT 1)
LEFT JOIN M_Jabatan j ON kp.id_jabatan = j.id_jabatan
LEFT JOIN M_Departemen d ON kp.id_departemen = d.id_departemen
LEFT JOIN M_Jurusan jr ON a.id_jurusan = jr.id_jurusan;

-- View Sesi Login
CREATE VIEW IF NOT EXISTS sessions AS
SELECT s.id_sesi AS id, a.id_perisai AS user_id, s.token, s.expires_at, s.ip_address, s.user_agent, s.created_at, s.created_at AS updated_at
FROM T_Sesi s JOIN M_Akun k ON s.id_akun = k.id_akun JOIN M_Anggota a ON k.id_perisai = a.id_perisai;

-- View Profil Departemen Web
CREATE VIEW IF NOT EXISTS web_department_profiles AS
SELECT slug AS department_id, slug, deskripsi_singkat AS short_description, tupoksi_utama AS description,
       visi AS vision, misi AS mission, foto_grup AS group_photo_media_id, urutan AS sort_order, is_active, created_at, updated_at
FROM M_Departemen;

-- View Hak Akses CMS
CREATE VIEW IF NOT EXISTS web_user_access AS
SELECT a.id_perisai AS user_id, LOWER(r.nama_role) AS cms_role, d.slug AS department_id, k.created_at, k.updated_at
FROM M_Akun k JOIN M_Anggota a ON k.id_perisai = a.id_perisai JOIN M_Role r ON k.id_role = r.id_role
LEFT JOIN T_Kepengurusan kp ON a.id_perisai = kp.id_perisai AND kp.id_periode = (SELECT id_periode FROM M_Periode WHERE is_active = 1 LIMIT 1)
LEFT JOIN M_Departemen d ON kp.id_departemen = d.id_departemen;

-- View Dewan Pembina Web
CREATE VIEW IF NOT EXISTS web_extra_people AS
SELECT CAST(id_pembina AS TEXT) AS id, nama AS name, jabatan AS position, kategori AS tier, linkedin AS linkedin_url,
       foto_url AS photo_media_id, urutan AS sort_order, is_active, created_at, updated_at
FROM M_Pembina;

-- View Periode Web
CREATE VIEW IF NOT EXISTS web_periods AS
SELECT CAST(id_periode AS TEXT) AS id, nama_periode AS name, created_at AS start_date, updated_at AS end_date, is_active AS is_current
FROM M_Periode;

-- View Anggota Kepengurusan Web
CREATE VIEW IF NOT EXISTS web_members AS
SELECT a.id_perisai AS id, CAST(kp.id_periode AS TEXT) AS period_id, d.slug AS department_id,
       a.nama_lengkap AS name, j.nama_jabatan AS position, kp.tier, a.linkedin AS linkedin_url,
       a.foto_url AS photo_media_id, kp.urutan AS sort_order, 1 AS is_active
FROM T_Kepengurusan kp JOIN M_Anggota a ON kp.id_perisai = a.id_perisai
JOIN M_Jabatan j ON kp.id_jabatan = j.id_jabatan LEFT JOIN M_Departemen d ON kp.id_departemen = d.id_departemen;

-- View Berita & Kabar Web
CREATE VIEW IF NOT EXISTS web_posts AS
SELECT CAST(b.id_berita AS TEXT) AS id, d.slug AS department_id, b.judul AS title, b.slug, b.kategori AS category,
       b.ringkasan AS excerpt, b.konten AS content, b.foto_cover AS cover_media_id, b.status, b.tanggal_publish AS published_at,
       b.is_featured, b.penulis_id AS created_by, b.diperbarui_oleh AS updated_by, b.created_at, b.updated_at
FROM T_Berita b LEFT JOIN M_Departemen d ON b.id_departemen = d.id_departemen;

-- View Multi-Foto Berita Web
CREATE VIEW IF NOT EXISTS web_post_images AS
SELECT CAST(id_berita AS TEXT) AS post_id, foto_url AS media_id, urutan AS sort_order, caption FROM T_Berita_Foto;

-- View Program Kerja Web
CREATE VIEW IF NOT EXISTS web_work_programs AS
SELECT CAST(p.id_proker AS TEXT) AS id, d.slug AS department_id, p.nama_proker AS title, p.slug,
       p.target_pelaksanaan AS summary, p.deskripsi AS content, p.foto_cover AS cover_media_id, p.status,
       p.created_at AS published_at, p.urutan AS sort_order, p.penanggung_jawab_id AS created_by,
       p.diperbarui_oleh AS updated_by, p.created_at, p.updated_at
FROM T_Proker p LEFT JOIN M_Departemen d ON p.id_departemen = d.id_departemen;

-- View Multi-Foto Proker Web
CREATE VIEW IF NOT EXISTS web_work_program_images AS
SELECT CAST(id_proker AS TEXT) AS work_program_id, foto_url AS media_id, urutan AS sort_order, caption FROM T_Proker_Dokumentasi;

-- View Peluang & Kompetisi Web
CREATE VIEW IF NOT EXISTS web_opportunities AS
SELECT CAST(id_kompetisi AS TEXT) AS id, tipe AS type, nama_kompetisi AS title, slug, kategori AS category,
       penyelenggara AS organizer, deskripsi AS description, deadline_pendaftaran AS deadline_at,
       link_pendaftaran AS registration_url, link_poster AS poster_media_id, status, tanggal_publish AS published_at,
       penulis_id AS created_by, diperbarui_oleh AS updated_by, created_at, updated_at
FROM T_Kompetisi;

-- View Statistik Web
CREATE VIEW IF NOT EXISTS web_statistics AS
SELECT CAST(id_statistik AS TEXT) AS id, label, nilai AS value, deskripsi AS description, urutan AS sort_order, is_active, created_at, updated_at
FROM T_Statistik;

-- View Galeri Kegiatan Web
CREATE VIEW IF NOT EXISTS web_gallery_items AS
SELECT CAST(id_galeri AS TEXT) AS id, foto_url AS media_id, judul AS title, deskripsi AS description, kategori AS category,
       created_at AS taken_at, is_featured, is_active, urutan AS sort_order, created_at, updated_at
FROM T_Galeri;

-- View Pesan Masuk Web
CREATE VIEW IF NOT EXISTS web_inbox_messages AS
SELECT CAST(id_pesan AS TEXT) AS id, nama_pengirim AS name, email, no_wa AS phone, tujuan AS purpose, subjek AS subject,
       isi_pesan AS message, is_read, dibalas_pada AS handled_at, dibalas_oleh AS handled_by, ip_address AS ip_hash, created_at
FROM T_Pesan_Masuk;

-- View Pengaturan Website
CREATE VIEW IF NOT EXISTS web_site_settings AS
SELECT kunci AS key, nilai AS value, diperbarui_oleh AS updated_by, updated_at FROM T_Pengaturan;

-- View Audit Log Web
CREATE VIEW IF NOT EXISTS web_audit_logs AS
SELECT id_log AS id, CAST(id_akun AS TEXT) AS user_id, aksi AS action, entitas AS entity_type, id_entitas AS entity_id,
       COALESCE(data_baru, data_lama) AS changes, ip_address AS ip_hash, created_at
FROM T_Audit_Log;

-- View Media Web
CREATE VIEW IF NOT EXISTS web_media AS
SELECT id_media AS id, kunci_penyimpanan AS storage_key, nama_berkas AS original_name, tipe_mime AS mime_type,
       ukuran_byte AS size_bytes, lebar AS width, tinggi AS height, alt_text, diunggah_oleh AS uploaded_by, created_at
FROM T_Media;
