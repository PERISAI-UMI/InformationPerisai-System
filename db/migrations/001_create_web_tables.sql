-- Migration: 001_create_web_tables.sql
-- Description: Menambahkan tabel baru berawalan web_* untuk website PERISAI UMI tanpa mengubah tabel PSDM

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

CREATE INDEX IF NOT EXISTS idx_web_posts_status ON web_posts (status, published_at);
CREATE INDEX IF NOT EXISTS idx_web_posts_slug ON web_posts (slug);
CREATE INDEX IF NOT EXISTS idx_web_work_programs_dept ON web_work_programs (department_id);
CREATE INDEX IF NOT EXISTS idx_web_opportunities_status ON web_opportunities (status, deadline_at);
CREATE INDEX IF NOT EXISTS idx_web_gallery_items_active ON web_gallery_items (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_web_inbox_messages_read ON web_inbox_messages (is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_web_members_period ON web_members (period_id, tier, sort_order);

