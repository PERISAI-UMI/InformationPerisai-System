#!/usr/bin/env bash
set -e

BACKUP_DIR="/var/backups/perisai-umi"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/db_backup_$DATE.sql.gz"
RETENTION_DAYS=14

mkdir -p "$BACKUP_DIR"

echo "💾 [Backup] Memulai pencadangan database PostgreSQL..."

# Ambil DATABASE_URL dari .env jika ada
if [ -f "/opt/perisai-umi/.env" ]; then
  export $(grep -v '^#' /opt/perisai-umi/.env | xargs)
fi

if [ -n "$DATABASE_URL" ]; then
  pg_dump "$DATABASE_URL" | gzip > "$FILENAME"
else
  pg_dump -U perisai_user -d perisai_db | gzip > "$FILENAME"
fi

echo "✅ [Backup] Cadangan tersimpan di: $FILENAME ($(du -h "$FILENAME" | cut -f1))"

# Hapus backup yang lebih lama dari RETENTION_DAYS
echo "🧹 [Backup] Membersihkan cadangan lebih dari $RETENTION_DAYS hari..."
find "$BACKUP_DIR" -type f -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "✨ [Backup] Selesai."
