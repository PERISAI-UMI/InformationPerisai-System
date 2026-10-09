# Panduan Setup Server dari Nol — UKM PERISAI UMI

Panduan langkah demi langkah untuk mengonfigurasi Virtual Private Server (VPS) Ubuntu 22.04/24.04 LTS dari awal hingga sistem siap melayani pengunjung.

---

## 1. Pembaruan Server & Pembuatan User
```bash
sudo apt update && sudo apt upgrade -y
sudo useradd -m -s /bin/bash perisai
sudo usermod -aG sudo perisai
```

---

## 2. Instalasi Node.js (v20 LTS) & Git
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential
node -v # Pastikan >= v20.x
```

---

## 3. Instalasi Basis Data PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE USER perisai_user WITH PASSWORD 'PasswordKuatDisini';"
sudo -u postgres psql -c "CREATE DATABASE perisai_db OWNER perisai_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE perisai_db TO perisai_user;"
```

---

## 4. Kloning Repository & Konfigurasi Direktori
```bash
sudo mkdir -p /opt/perisai-umi
sudo chown -R perisai:perisai /opt/perisai-umi

# Sebagai user perisai
git clone <REPO_URL> /opt/perisai-umi
cd /opt/perisai-umi
cp .env.example .env
nano .env # Lengkapi konfigurasi DATABASE_URL, AUTH_SECRET, dll.
npm ci
npx prisma migrate deploy
npm run seed
npm run build
```

---

## 5. Konfigurasi Layanan Systemd
```bash
sudo cp /opt/perisai-umi/deploy/perisai-umi.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable perisai-umi
sudo systemctl start perisai-umi
sudo systemctl status perisai-umi
```

---

## 6. Konfigurasi Caddy Web Server (SSL Otomatis)
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy

sudo cp /opt/perisai-umi/deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl restart caddy
```

---

## 7. Penjadwalan Backup Otomatis
```bash
sudo crontab -e
# Tambahkan:
0 2 * * * /bin/bash /opt/perisai-umi/deploy/backup.sh >> /var/log/perisai-backup.log 2>&1
```
