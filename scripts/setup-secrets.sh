#!/usr/bin/env bash

# ==============================================================================
# UKM PERISAI UMI — Cloudflare Workers Secrets Setup Script
# ==============================================================================
# Skrip ini mempermudah pendaftaran secrets sensitif ke Cloudflare Workers
# menggunakan Cloudflare Wrangler CLI ('wrangler secret put').
#
# Penggunaan:
#   bash scripts/setup-secrets.sh            # Mode interaktif / otomatis dari .env
#   bash scripts/setup-secrets.sh --dry-run  # Tampilkan perintah tanpa eksekusi
# ==============================================================================

set -e

DRY_RUN=false
if [ "$1" = "--dry-run" ]; then
  DRY_RUN=true
fi

echo "=========================================================="
echo "🔐 UKM PERISAI UMI — Pendaftaran Secrets Cloudflare Workers"
echo "=========================================================="

if [ "$DRY_RUN" = true ]; then
  echo "🔍 [DRY RUN MODE AKTIF] Perintah hanya akan ditampilkan, tidak dieksekusi."
  echo ""
fi

# Cek keberadaan file .env
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  if [ -f ".dev.vars" ]; then
    ENV_FILE=".dev.vars"
  else
    echo "ℹ️  File .env atau .dev.vars tidak ditemukan."
    echo "   Skrip akan menanyakan nilai untuk setiap secret secara interaktif."
    echo ""
  fi
fi

# Daftar secrets yang wajib/rekomendasi untuk didaftarkan ke Cloudflare Workers
SECRETS=(
  "TURSO_DATABASE_URL"
  "TURSO_AUTH_TOKEN"
  "R2_ENDPOINT"
  "R2_BUCKET"
  "R2_ACCESS_KEY_ID"
  "R2_SECRET_ACCESS_KEY"
  "R2_PUBLIC_URL"
  "AUTH_SECRET"
  "NEXT_PUBLIC_APP_URL"
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY"
  "CLOUDFLARE_TURNSTILE_SECRET_KEY"
  "CLOUDFLARE_ZONE_ID"
  "CLOUDFLARE_API_TOKEN"
)

# Helper function untuk membaca nilai dari file env
get_env_val() {
  local key="$1"
  if [ -f "$ENV_FILE" ]; then
    grep -E "^${key}=" "$ENV_FILE" | head -n 1 | cut -d '=' -f2- | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//'
  fi
}

SUCCESS_COUNT=0
SKIPPED_COUNT=0

for SECRET in "${SECRETS[@]}"; do
  VAL=""
  if [ -f "$ENV_FILE" ]; then
    VAL=$(get_env_val "$SECRET")
  fi

  # Abaikan nilai template/placeholder bawaan
  case "$VAL" in
    your-*|ganti-*|\<*|"")
      VAL=""
      ;;
  esac

  if [ -z "$VAL" ]; then

    if [ "$DRY_RUN" = true ]; then
      echo "⏩ $SECRET : (Belum diisi di $ENV_FILE / dilewati)"
      SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
      continue
    fi

    # Mode interaktif jika stdin terminal
    if [ -t 0 ]; then
      read -r -p "Masukkan nilai untuk $SECRET (tekan Enter untuk lewati): " INPUT_VAL
      VAL="$INPUT_VAL"
    fi
  fi

  if [ -n "$VAL" ]; then
    if [ "$DRY_RUN" = true ]; then
      echo "👉 npx wrangler secret put $SECRET"
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
      echo "⏳ Mengunggah secret: $SECRET..."
      echo -n "$VAL" | npx wrangler secret put "$SECRET"
      echo "✅ Berhasil mendaftarkan $SECRET"
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    fi
  else
    echo "⏩ Melewati $SECRET (kosong)"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
  fi
done

echo ""
echo "=========================================================="
echo "📊 Ringkasan Pendaftaran Secrets:"
echo "   - Diproses : $SUCCESS_COUNT secret"
echo "   - Dilewati : $SKIPPED_COUNT secret"
echo "=========================================================="
echo ""
echo "💡 Untuk memverifikasi daftar secret yang terdaftar di Cloudflare:"
echo "   npx wrangler secret list"
echo ""
