import { config } from "dotenv";
config();

import { createClient } from "@libsql/client";
import { S3StorageDriver } from "../src/lib/storage/s3";

async function testTursoConnection() {
  console.log("\n📡 [1/2] Menguji Koneksi ke Turso Cloud (LibSQL)...");
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL tidak ditemukan di .env");
  }

  console.log(`   URL Database: ${url}`);
  const startTime = Date.now();

  const client = createClient({
    url,
    authToken: authToken || undefined,
  });

  const pingResult = await client.execute("SELECT 1 as ping, datetime('now') as server_time;");
  const latency = Date.now() - startTime;

  console.log(`   ✅ Query Ping Berhasil! (${latency}ms)`);
  console.log(`   🕒 Waktu Server Basis Data: ${pingResult.rows[0]?.server_time}`);

  // Hitung jumlah tabel yang ada
  const tablesResult = await client.execute(
    "SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
  );
  console.log(`   📊 Total Tabel Terdeteksi: ${tablesResult.rows[0]?.count} tabel`);

  return { success: true, latency };
}

async function testR2Connection() {
  console.log("\n📦 [2/2] Menguji Koneksi ke Cloudflare R2 (Object Storage)...");
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !bucket || !accessKeyId || !secretKey) {
    throw new Error("Konfigurasi R2 tidak lengkap di .env (periksa R2_ENDPOINT, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)");
  }

  console.log(`   Bucket: ${bucket}`);
  console.log(`   Endpoint: ${endpoint}`);

  const driver = new S3StorageDriver();
  const testFileName = `test-connection-${Date.now()}.txt`;
  const testContent = Buffer.from(`Tes koneksi Cloudflare R2 berhasil pada ${new Date().toISOString()}`);

  const uploadStart = Date.now();
  console.log("   ⬆️  Mengunggah file uji coba...");
  const uploadResult = await driver.upload(testContent, testFileName, "text/plain");
  const uploadLatency = Date.now() - uploadStart;

  console.log(`   ✅ Berhasil diunggah! (${uploadLatency}ms)`);
  console.log(`   🔗 URL: ${uploadResult.url}`);
  console.log(`   📂 Path Objek: ${uploadResult.path}`);

  console.log("   🗑️  Menghapus file uji coba dari R2...");
  const deleteStart = Date.now();
  const deleteResult = await driver.delete(uploadResult.path);
  const deleteLatency = Date.now() - deleteStart;

  if (deleteResult) {
    console.log(`   ✅ File uji coba berhasil dihapus! (${deleteLatency}ms)`);
  } else {
    console.warn("   ⚠️ Gagal menghapus file uji coba secara otomatis.");
  }

  return { success: true, uploadLatency, deleteLatency };
}

async function runAllTests() {
  console.log("==================================================");
  console.log("🚀 MEMULAI UJI KONEKSI SISTEM (TURSO & CLOUDFLARE R2)");
  console.log("==================================================");

  let tursoOk = false;
  let r2Ok = false;

  try {
    await testTursoConnection();
    tursoOk = true;
  } catch (error) {
    console.error("   ❌ GAGAL Koneksi Turso:", error instanceof Error ? error.message : error);
  }

  try {
    await testR2Connection();
    r2Ok = true;
  } catch (error) {
    console.error("   ❌ GAGAL Koneksi R2:", error instanceof Error ? error.message : error);
  }

  console.log("\n==================================================");
  console.log("📋 HASIL RINGKASAN UJI KONEKSI:");
  console.log(`   1. Turso Cloud (LibSQL) : ${tursoOk ? "🟢 TERHUBUNG & BERFUNGSI" : "🔴 GAGAL"}`);
  console.log(`   2. Cloudflare R2 Storage: ${r2Ok ? "🟢 TERHUBUNG & BERFUNGSI" : "🔴 GAGAL"}`);
  console.log("==================================================\n");

  if (!tursoOk || !r2Ok) {
    process.exit(1);
  }
}

runAllTests();
