# Panduan Setup Server & Deployment — UKM PERISAI UMI

Panduan langkah demi langkah untuk mengonfigurasi Virtual Private Server (VPS) Ubuntu 22.04/24.04 LTS dari awal hingga InformationPerisai-System siap melayani pengunjung dengan performa tinggi, aman, dan stabil.

---

## 🏗️ Ringkasan Arsitektur Deployment

- **Aplikasi**: Next.js 16 (App Router, Node.js v20+) — Fullstack native (tanpa Docker).
- **Basis Data**: Berbagi database dengan sistem PSDM menggunakan skema komprehensif 21 tabel (`M_*` dan `T_*`) pada **SQLite** (`psdm-db.db`) atau **Turso Cloud LibSQL**. Dilengkapi perlindungan `db/guard.mjs`.
- **Process Manager**: Systemd (`perisai-umi.service`) untuk auto-restart dan manajemen background process.
- **Reverse Proxy**: Caddy Web Server dengan sertifikat HTTPS (SSL/TLS) otomatis dari Let's Encrypt / ZeroSSL.
- **Edge CDN & Keamanan**: Cloudflare (DNS, DDoS Protection, WAF, Caching).

---

## 1. Pembaruan Server & Pembuatan User

Masuk ke VPS via SSH sebagai root, perbarui paket, dan buat user non-root khusus aplikasi:

```bash
sudo apt update && sudo apt upgrade -y
sudo useradd -m -s /bin/bash perisai
sudo usermod -aG sudo perisai
```

---

## 2. Instalasi Node.js (v20 LTS) & Git

Pasang Node.js 20 LTS dan kakas kompilasi native yang dibutuhkan oleh Better-SQLite3:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential sqlite3
node -v # Pastikan >= v20.x
npm -v
```

---

## 3. Konfigurasi Basis Data (SQLite / Turso)

Sistem InformationPerisai-System dirancang untuk hemat sumber daya dan terintegrasi aman dengan data kepengurusan:

### Opsi A: SQLite Lokal (psdm-db.db) — Rekomendasi Mandiri
Jika file database PSDM berada di server lokal:
1. Letakkan berkas `psdm-db.db` pada direktori proyek `/opt/perisai-umi/psdm-db.db`.
2. Pastikan file database memiliki hak akses baca-tulis untuk user `perisai`:
   ```bash
   sudo chown perisai:perisai /opt/perisai-umi/psdm-db.db
   chmod 660 /opt/perisai-umi/psdm-db.db
   ```
3. Eksekusi skema 21 tabel dan seeding data pengurus riil jika belum ada:
   ```bash
   npx tsx scripts/seed-complete-2026.ts
   ```

### Opsi B: Turso Cloud LibSQL — Rekomendasi Replikasi Cloud
Jika menggunakan database Turso terdistribusi:
- Dapatkan URL database (`libsql://...`) dan Auth Token dari dasbor Turso.
- Isikan pada variabel lingkungan `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN`.
- Jalankan sinkronisasi migrasi skema:
   ```bash
   node scripts/migrate-and-seed-turso.mjs
   ```

---

## 4. Kloning Repository & Pengaturan Proyek

Siapkan direktori aplikasi dan unduh repositori:

```bash
sudo mkdir -p /opt/perisai-umi
sudo chown -R perisai:perisai /opt/perisai-umi

# Berpindah ke user perisai
sudo -u perisai -i
cd /opt/perisai-umi

# Clone repositori
git clone https://github.com/PERISAI-UMI/InformationPerisai-System.git .

# Konfigurasi berkas lingkungan (.env)
cp .env.example .env
nano .env # Lengkapi konfigurasi rahasia AUTH_SECRET, database, dll.

# Instal dependensi bersih
npm ci

# Verifikasi integritas skema dengan Schema Guard
node db/guard.mjs live

# Bangun bundel produksi Next.js
npm run build
```

---

## 5. Konfigurasi Layanan Systemd

Gunakan Systemd agar aplikasi berjalan otomatis saat boot dan restart saat terjadi kegagalan:

```bash
# Salin file unit systemd
sudo cp /opt/perisai-umi/deploy/perisai-umi.service /etc/systemd/system/

# Muat ulang konfigurasi daemon
sudo systemctl daemon-reload

# Aktifkan dan jalankan layanan
sudo systemctl enable perisai-umi
sudo systemctl start perisai-umi

# Periksa status layanan
sudo systemctl status perisai-umi
```

Untuk melihat log aplikasi secara langsung:
```bash
journalctl -u perisai-umi -f
```

---

## 6. Konfigurasi Caddy Web Server (HTTPS Otomatis)

Caddy bertindak sebagai reverse proxy yang meneruskan traffic HTTPS publik (port 443) ke port internal Next.js (port 3000):

```bash
# Instal Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy

# Salin konfigurasi Caddyfile
sudo cp /opt/perisai-umi/deploy/Caddyfile /etc/caddy/Caddyfile

# Edit domain resmi organisasi
sudo nano /etc/caddy/Caddyfile

# Muat ulang konfigurasi Caddy
sudo systemctl restart caddy
```

---

## 7. Otomasi Pencadangan Data (Backup Cron)

Jadwalkan pencadangan otomatis setiap malam pukul 02:00 WITA menggunakan skrip [`deploy/backup.sh`](./backup.sh):

```bash
sudo crontab -e
```
Tambahkan baris berikut:
```cron
0 2 * * * /bin/bash /opt/perisai-umi/deploy/backup.sh >> /var/log/perisai-backup.log 2>&1
```

---

## 8. Alur Deployment Otomatis (Update Aplikasi)

Ketika ada update fitur di branch `main`, cukup jalankan skrip deploy terpadu:

```bash
cd /opt/perisai-umi
bash deploy/deploy.sh
```

Skrip [`deploy/deploy.sh`](./deploy.sh) secara otomatis akan melakukan:
1. `git fetch` & sinkronisasi branch `main`.
2. `npm ci` untuk instalasi dependensi bersih.
3. Pemeriksaan `node db/guard.mjs live` untuk validasi keamanan skema.
4. `npm run build` kompilasi Next.js produksi.
5. `systemctl restart perisai-umi` muat ulang proses.
6. Pengecekan otomatis status endpoint `/api/health`.
