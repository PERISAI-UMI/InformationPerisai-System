#!/usr/bin/env bash
set -e

echo "🚀 [Deploy] Memulai proses deployment UKM PERISAI UMI..."

# 1. Navigasi ke direktori kerja
APP_DIR="/opt/perisai-umi"
cd "$APP_DIR"

# 2. Ambil perubahan terbaru dari git
echo "📥 [Deploy] Mengambil kode terbaru dari repository..."
git fetch origin main
git reset --hard origin/main

# 3. Pasang dependensi secara bersih
echo "📦 [Deploy] Memasang dependensi (npm ci)..."
npm ci --prefer-offline --no-audit

# 4. Terapkan migrasi database prisma
echo "🗄️ [Deploy] Menjalankan migrasi basis data..."
npx prisma migrate deploy

# 5. Bangun produksi Next.js
echo "🏗️ [Deploy] Membangun aplikasi produksi (npm run build)..."
npm run build

# 6. Muat ulang layanan systemd
echo "🔄 [Deploy] Me-restart layanan perisai-umi.service..."
sudo systemctl restart perisai-umi

# 7. Verifikasi kesehatan aplikasi
echo "🩺 [Deploy] Memeriksa status kesehatan aplikasi..."
sleep 3
curl -s -f http://127.0.0.1:3000/api/health > /dev/null && echo "✅ Layanan aktif dan sehat!" || echo "⚠️ Peringatan: Health check belum merespon."

echo "🎉 [Deploy] Deployment berhasil selesai!"
