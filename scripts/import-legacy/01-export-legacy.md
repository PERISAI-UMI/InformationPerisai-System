# 01 - Cara Ekspor Data dari Basis Data Laravel Lama

Dokumen ini menjelaskan langkah-langkah mengekspor tabel dari MySQL Laravel lama untuk diproses oleh skrip impor TypeScript.

---

## Opsi 1: Ekspor Tabel ke Format JSON via MySQL CLI / phpMyAdmin

Jalankan perintah SQL berikut di MySQL database lama untuk menghasilkan file JSON di folder `scripts/import-legacy/data/`:

```sql
-- departments.json
SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'name', name, 'slug', slug, 'description', description, 'created_at', created_at)) FROM departments;

-- periods.json
SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'name', name, 'is_active', is_active, 'start_date', start_date, 'end_date', end_date)) FROM periods;

-- members.json
SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'name', name, 'nim', nim, 'department_id', department_id, 'period_id', period_id, 'position', position)) FROM members;

-- news -> posts.json
SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'title', title, 'slug', slug, 'content', content, 'status', status, 'created_at', created_at)) FROM news;

-- competitions -> opportunities.json
SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'title', title, 'slug', slug, 'organizer', organizer, 'deadline_at', deadline_at, 'description', description)) FROM competitions;
```

---

## Opsi 2: Ekspor Menggunakan Artisan Command (Laravel)

Jika aplikasi Laravel lama masih bisa dijalankan di lokal:
```bash
php artisan tinker
```
Lalu jalankan ekspor sederhana:
```php
file_put_contents('legacy_export.json', json_encode([
    'departments' => \DB::table('departments')->get(),
    'periods' => \DB::table('periods')->get(),
    'members' => \DB::table('members')->get(),
    'news' => \DB::table('news')->get(),
    'competitions' => \DB::table('competitions')->get(),
    'work_programs' => \DB::table('work_programs')->get(),
    'statistics' => \DB::table('statistics')->get(),
]));
```
Simpan berkas hasil ekspor ke `scripts/import-legacy/legacy_export.json`.
