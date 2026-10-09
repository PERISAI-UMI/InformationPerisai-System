#!/usr/bin/env bash
set -e

BACKUP_DIR="/var/backups/perisai-umi"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=14

mkdir -p "$BACKUP_DIR"

echo "💾 [Backup] Memulai pencadangan database UKM PERISAI UMI..."

# Muat environment variable jika ada
if [ -f "/opt/perisai-umi/.env" ]; then
  export $(grep -v '^#' /opt/perisai-umi/.env | xargs)
fi

# 1. Pencadangan SQLite (psdm-db.db)
if [ -f "/opt/perisai-umi/psdm-db.db" ]; then
  FILENAME="$BACKUP_DIR/psdm_sqlite_$DATE.db.gz"
  if command -v sqlite3 &> /dev/null; then
    sqlite3 /opt/perisai-umi/psdm-db.db ".backup '/tmp/backup_tmp_$DATE.db'"
    gzip -c "/tmp/backup_tmp_$DATE.db" > "$FILENAME"
    rm -f "/tmp/backup_tmp_$DATE.db"
  else
    gzip -c /opt/perisai-umi/psdm-db.db > "$FILENAME"
  fi
  echo "✅ [Backup] Cadangan SQLite tersimpan di: $FILENAME ($(du -h "$FILENAME" | cut -f1))"

# 2. Pencadangan PostgreSQL (opsional)
elif [ -n "$DATABASE_URL" ] && [[ "$DATABASE_URL" == postgres* ]]; then
  FILENAME="$BACKUP_DIR/pg_backup_$DATE.sql.gz"
  pg_dump "$DATABASE_URL" | gzip > "$FILENAME"
  echo "✅ [Backup] Cadangan PostgreSQL tersimpan di: $FILENAME ($(du -h "$FILENAME" | cut -f1))"
else
  echo "ℹ️ [Backup] Menggunakan Turso Cloud atau database eksternal. Pastikan backup otomatis Turso aktif."
fi

# Hapus backup yang lebih lama dari RETENTION_DAYS
echo "🧹 [Backup] Membersihkan cadangan lebih dari $RETENTION_DAYS hari..."
find "$BACKUP_DIR" -type f -name "*_backup_*.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find "$BACKUP_DIR" -type f -name "psdm_sqlite_*.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

echo "✨ [Backup] Selesai."
