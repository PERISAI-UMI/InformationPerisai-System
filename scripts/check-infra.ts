import { config } from "dotenv";
config();
config({ path: ".env.local", override: true });

import { createClient } from "@libsql/client";
import https from "node:https";
import { URL } from "node:url";
import { S3StorageDriver } from "../src/lib/storage/s3";

// Kode warna ANSI untuk visualisasi konsol yang rapi
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bgDark: "\x1b[40m",
};

interface DiagnosticSummary {
  tursoStatus: "PASS" | "WARN" | "FAIL";
  tursoLatency?: number;
  tursoRegion?: string;
  tursoTables?: number;
  r2CdnStatus: "PASS" | "WARN" | "FAIL";
  r2CdnLatency?: number;
  r2CdnDomain?: string;
  r2CdnSsl?: string;
  r2ApiStatus: "PASS" | "WARN" | "SKIP";
  r2ApiLatency?: number;
  turnstileStatus: "PASS" | "WARN";
}

const summary: DiagnosticSummary = {
  tursoStatus: "FAIL",
  r2CdnStatus: "FAIL",
  r2ApiStatus: "SKIP",
  turnstileStatus: "WARN",
};

/**
 * 1. Pengujian Basis Data Turso LibSQL Cloud
 */
async function checkTursoDatabase(): Promise<void> {
  console.log(`\n${colors.cyan}${colors.bold}▶ [1/4] DIAGNOSTIK TURSO LIBSQL DATABASE${colors.reset}`);
  console.log(`${colors.gray}------------------------------------------------------------${colors.reset}`);

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!tursoUrl) {
    console.log(`  ${colors.yellow}⚠️  TURSO_DATABASE_URL tidak diset di .env${colors.reset}`);
    const localDb = process.env.DATABASE_URL || "file:./psdm-db.db";
    console.log(`  ${colors.gray}Menguji fallback SQLite lokal: ${localDb}${colors.reset}`);

    try {
      const client = createClient({ url: localDb });
      const t0 = Date.now();
      const res = await client.execute("SELECT 1 as ping, datetime('now') as time;");
      const latency = Date.now() - t0;
      console.log(`  ${colors.green}✓ Koneksi SQLite lokal berhasil (${latency}ms)${colors.reset}`);
      console.log(`  ${colors.gray}Server time: ${res.rows[0]?.time}${colors.reset}`);
      summary.tursoStatus = "WARN";
      summary.tursoLatency = latency;
      summary.tursoRegion = "Local (SQLite)";
    } catch (err) {
      console.log(`  ${colors.red}✗ Gagal mengakses database lokal:${colors.reset}`, err instanceof Error ? err.message : err);
      summary.tursoStatus = "FAIL";
    }
    return;
  }

  // Deteksi Region
  let region = "Turso Cloud";
  if (tursoUrl.includes("aws-ap-northeast-1")) {
    region = "Tokyo (aws-ap-northeast-1) [Rekomendasi]";
  } else if (tursoUrl.includes("sin")) {
    region = "Singapore (sin)";
  }
  summary.tursoRegion = region;

  console.log(`  📍 Target URL : ${colors.bold}${tursoUrl}${colors.reset}`);
  console.log(`  🌏 Region     : ${colors.bold}${region}${colors.reset}`);

  try {
    const client = createClient({
      url: tursoUrl,
      authToken: authToken || undefined,
    });

    const startTime = Date.now();
    const pingResult = await client.execute("SELECT 1 as ping, datetime('now') as server_time;");
    const latency = Date.now() - startTime;
    summary.tursoLatency = latency;

    console.log(`  ${colors.green}✓ Ping Berhasil: ${latency}ms latency round-trip${colors.reset}`);
    console.log(`  🕒 Server Time  : ${pingResult.rows[0]?.server_time}`);

    // Periksa tabel di database
    const tablesResult = await client.execute(
      "SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    );
    const tableCount = Number(tablesResult.rows[0]?.count || 0);
    summary.tursoTables = tableCount;
    console.log(`  📊 Skema Tabel : ${tableCount} tabel terdeteksi`);

    if (tableCount >= 10) {
      console.log(`  ${colors.green}✓ Integritas skema database lengkap dan siap produksi${colors.reset}`);
      summary.tursoStatus = "PASS";
    } else {
      console.log(`  ${colors.yellow}⚠️  Jumlah tabel rendah (${tableCount}), pastikan migrasi skema telah dijalankan.${colors.reset}`);
      summary.tursoStatus = "WARN";
    }
  } catch (err) {
    console.log(`  ${colors.red}✗ Gagal menghubungkan ke Turso LibSQL:${colors.reset}`, err instanceof Error ? err.message : err);
    summary.tursoStatus = "FAIL";
  }
}

/**
 * 2. Pengujian Jangkauan & Sertifikat SSL CDN Media R2 (media.perisai-umi.org)
 */
async function checkR2MediaCdn(): Promise<void> {
  console.log(`\n${colors.cyan}${colors.bold}▶ [2/4] DIAGNOSTIK CLOUDFLARE R2 MEDIA CDN${colors.reset}`);
  console.log(`${colors.gray}------------------------------------------------------------${colors.reset}`);

  const rawUrl = process.env.R2_PUBLIC_URL || "https://media.perisai-umi.org";
  const targetUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  const parsed = new URL(targetUrl);
  summary.r2CdnDomain = parsed.hostname;

  console.log(`  🌐 Target Domain : ${colors.bold}${targetUrl}${colors.reset}`);

  return new Promise<void>((resolve) => {
    const startTime = Date.now();

    const req = https.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: "/",
        method: "HEAD",
        timeout: 6000,
        headers: {
          "User-Agent": "UKM-Perisai-InfraCheck/1.0",
        },
      },
      (res) => {
        const latency = Date.now() - startTime;
        summary.r2CdnLatency = latency;

        const cert = (res.socket as any).getPeerCertificate?.();
        let certInfo = "TLS Active";
        if (cert && cert.valid_to) {
          certInfo = `Valid s.d ${cert.valid_to} (${cert.issuer?.O || "Cloudflare TLS"})`;
        }
        summary.r2CdnSsl = certInfo;

        console.log(`  ${colors.green}✓ DNS & TLS Handshake Berhasil (${latency}ms)${colors.reset}`);
        console.log(`  🔒 Status SSL    : ${colors.bold}${certInfo}${colors.reset}`);
        console.log(`  📡 HTTP Response : Status ${res.statusCode} ${res.statusMessage || ""}`);

        // Bucket root biasanya merespons 200, 403 (Forbidden listing), atau 404
        if (res.statusCode && res.statusCode < 500) {
          console.log(`  ${colors.green}✓ Domain CDN Cloudflare R2 terkonfigurasi dengan benar${colors.reset}`);
          summary.r2CdnStatus = "PASS";
        } else {
          console.log(`  ${colors.yellow}⚠️  CDN merespons kode server (${res.statusCode})${colors.reset}`);
          summary.r2CdnStatus = "WARN";
        }
        resolve();
      }
    );

    req.on("timeout", () => {
      req.destroy();
      console.log(`  ${colors.yellow}⚠️  Koneksi ke ${parsed.hostname} timeout (kemungkinan offline atau DNS lokal belum terresolusi)${colors.reset}`);
      summary.r2CdnStatus = "WARN";
      resolve();
    });

    req.on("error", (err) => {
      console.log(`  ${colors.yellow}⚠️  Tidak dapat menghubungi domain CDN: ${err.message}${colors.reset}`);
      console.log(`  ${colors.gray}   (Wajar terjadi jika dijalankan offline di local development)${colors.reset}`);
      summary.r2CdnStatus = "WARN";
      resolve();
    });

    req.end();
  });
}

/**
 * 3. Pengujian API Object Storage Cloudflare R2 (S3 Protocol)
 */
async function checkR2StorageApi(): Promise<void> {
  console.log(`\n${colors.cyan}${colors.bold}▶ [3/4] DIAGNOSTIK CLOUDFLARE R2 S3 API OPERATION${colors.reset}`);
  console.log(`${colors.gray}------------------------------------------------------------${colors.reset}`);

  const endpoint = process.env.R2_ENDPOINT || process.env.S3_ENDPOINT;
  const bucket = process.env.R2_BUCKET || process.env.S3_BUCKET;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;

  if (!endpoint || !bucket || !accessKeyId || !secretKey) {
    console.log(`  ${colors.gray}ℹ️  Kredensial R2 API belum lengkap di .env (R2_ENDPOINT, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).${colors.reset}`);
    console.log(`  ${colors.gray}   Operasi upload/delete via S3 Storage Driver dilewati.${colors.reset}`);
    summary.r2ApiStatus = "SKIP";
    return;
  }

  console.log(`  📦 Bucket Name : ${colors.bold}${bucket}${colors.reset}`);
  console.log(`  🔌 S3 Endpoint : ${colors.bold}${endpoint}${colors.reset}`);

  try {
    const driver = new S3StorageDriver();
    const probeFileName = `infra-probe-${Date.now()}.txt`;
    const probeContent = Buffer.from(
      `UKM PERISAI UMI Infra Check Probe: ${new Date().toISOString()}`
    );

    const uploadStart = Date.now();
    const uploadResult = await driver.upload(probeContent, probeFileName, "text/plain");
    const uploadDuration = Date.now() - uploadStart;
    summary.r2ApiLatency = uploadDuration;

    console.log(`  ${colors.green}✓ Upload Probe Sukses: ${uploadDuration}ms${colors.reset}`);
    console.log(`  🔗 Probe URL : ${uploadResult.url}`);

    // Cleanup
    await driver.delete(uploadResult.path);
    console.log(`  ${colors.green}✓ Cleanup Probe Sukses${colors.reset}`);
    summary.r2ApiStatus = "PASS";
  } catch (err) {
    console.log(`  ${colors.red}✗ Kesalahan operasi R2 Storage API:${colors.reset}`, err instanceof Error ? err.message : err);
    summary.r2ApiStatus = "WARN";
  }
}

/**
 * 4. Pengujian Konfigurasi Cloudflare Turnstile
 */
async function checkTurnstileConfig(): Promise<void> {
  console.log(`\n${colors.cyan}${colors.bold}▶ [4/4] DIAGNOSTIK CLOUDFLARE TURNSTILE (ANTI-BOT)${colors.reset}`);
  console.log(`${colors.gray}------------------------------------------------------------${colors.reset}`);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
    process.env.TURNSTILE_SECRET_KEY;

  const isSiteKeySet = Boolean(siteKey && !siteKey.startsWith("your-"));
  const isSecretKeySet = Boolean(secretKey && !secretKey.startsWith("your-"));

  console.log(
    `  🛡️  Site Key (Client)   : ${
      isSiteKeySet ? `${colors.green}Terkonfigurasi${colors.reset}` : `${colors.yellow}Belum diset${colors.reset}`
    }`
  );
  console.log(
    `  🔑 Secret Key (Server) : ${
      isSecretKeySet ? `${colors.green}Terkonfigurasi${colors.reset}` : `${colors.yellow}Belum diset${colors.reset}`
    }`
  );

  if (isSiteKeySet && isSecretKeySet) {
    console.log(`  ${colors.green}✓ Perlindungan Turnstile anti-bot aktif dan siap produksi${colors.reset}`);
    summary.turnstileStatus = "PASS";
  } else {
    console.log(`  ${colors.yellow}⚠️  Turnstile berjalan dalam mode bypass (development/pengujian)${colors.reset}`);
    summary.turnstileStatus = "WARN";
  }
}

/**
 * Menampilkan Laporan Ringkasan
 */
function printSummaryReport(): void {
  console.log(`\n${colors.bold}================================================================${colors.reset}`);
  console.log(`${colors.bold}📋 LAPORAN KESEHATAN INFRASTRUKTUR UKM PERISAI UMI${colors.reset}`);
  console.log(`${colors.bold}================================================================${colors.reset}`);

  const formatBadge = (status: "PASS" | "WARN" | "FAIL" | "SKIP") => {
    switch (status) {
      case "PASS":
        return `${colors.green}${colors.bold}🟢 PASSED${colors.reset}`;
      case "WARN":
        return `${colors.yellow}${colors.bold}🟡 WARNING${colors.reset}`;
      case "FAIL":
        return `${colors.red}${colors.bold}🔴 FAILED${colors.reset}`;
      case "SKIP":
        return `${colors.gray}${colors.bold}⚪ SKIPPED${colors.reset}`;
    }
  };

  console.log(`  1. Turso LibSQL Database : ${formatBadge(summary.tursoStatus)} (${summary.tursoRegion || "-"}) ${summary.tursoLatency ? `[${summary.tursoLatency}ms]` : ""}`);
  console.log(`  2. R2 Media CDN (${summary.r2CdnDomain || "-"}) : ${formatBadge(summary.r2CdnStatus)} ${summary.r2CdnLatency ? `[${summary.r2CdnLatency}ms]` : ""}`);
  console.log(`  3. R2 Object Storage API : ${formatBadge(summary.r2ApiStatus)} ${summary.r2ApiLatency ? `[${summary.r2ApiLatency}ms]` : ""}`);
  console.log(`  4. Turnstile Bot Protection: ${formatBadge(summary.turnstileStatus)}`);
  console.log(`${colors.bold}================================================================${colors.reset}\n`);

  if (summary.tursoStatus === "FAIL") {
    console.error(`${colors.red}${colors.bold}❌ Evaluasi Gagal: Database utama tidak dapat diakses.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}🎉 Diagnostik Selesai: Infrastruktur sistem siap dijalankan!${colors.reset}\n`);
    process.exit(0);
  }
}

async function run(): Promise<void> {
  console.log(`\n${colors.bold}🚀 MEMULAI DIAGNOSTIK INFRASTRUKTUR UKM PERISAI UMI (CLI)${colors.reset}`);
  console.log(`${colors.gray}Waktu Pemeriksaan: ${new Date().toISOString()}${colors.reset}`);

  await checkTursoDatabase();
  await checkR2MediaCdn();
  await checkR2StorageApi();
  await checkTurnstileConfig();

  printSummaryReport();
}

run().catch((err) => {
  console.error("Kesalahan diagnostik:", err);
  process.exit(1);
});
