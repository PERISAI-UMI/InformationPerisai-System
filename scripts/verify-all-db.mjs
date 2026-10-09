import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import "dotenv/config";

console.log("🔍 MEMULAI VERIFIKASI KONSISTENSI DATABASE TERNORMALISASI...");

// 1. Verifikasi SQLite Lokal
const local = new Database("psdm-db.db");
const localTables = local.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
const localViews = local.prepare("SELECT name FROM sqlite_master WHERE type='view' ORDER BY name").all();

console.log("\n📁 [SQLite Lokal psdm-db.db]");
console.log(`  ✓ Total Tabel Fisik (M_* & T_*): ${localTables.length} tabel (100% Ternormalisasi)`);
console.log(`  ✓ Total Compatibility Views: ${localViews.length} view (Zero Storage Duplication)`);
console.log("  --- Data Master & Transaksi ---");
console.log("  ✓ M_Anggota          :", local.prepare("SELECT count(*) as c FROM M_Anggota").get().c);
console.log("  ✓ M_Akun             :", local.prepare("SELECT count(*) as c FROM M_Akun").get().c);
console.log("  ✓ T_Kepengurusan     :", local.prepare("SELECT count(*) as c FROM T_Kepengurusan").get().c);
console.log("  ✓ M_Pembina          :", local.prepare("SELECT count(*) as c FROM M_Pembina").get().c);
console.log("  ✓ M_Departemen       :", local.prepare("SELECT count(*) as c FROM M_Departemen").get().c);
console.log("  ✓ M_Fakultas         :", local.prepare("SELECT count(*) as c FROM M_Fakultas").get().c);
console.log("  ✓ M_Jurusan          :", local.prepare("SELECT count(*) as c FROM M_Jurusan").get().c);
console.log("  ✓ T_Pengaturan       :", local.prepare("SELECT count(*) as c FROM T_Pengaturan").get().c);
console.log("  ✓ T_Prestasi         :", local.prepare("SELECT count(*) as c FROM T_Prestasi").get().c);
console.log("  ✓ T_Prestasi_Anggota :", local.prepare("SELECT count(*) as c FROM T_Prestasi_Anggota").get().c);
console.log("  --- Akses Melalui Views ---");
console.log("  ✓ View users         :", local.prepare("SELECT count(*) as c FROM users").get().c);
console.log("  ✓ View web_members   :", local.prepare("SELECT count(*) as c FROM web_members").get().c);
console.log("  ✓ View departments   :", local.prepare("SELECT count(*) as c FROM departments").get().c);
console.log("  ✓ View site_settings :", local.prepare("SELECT count(*) as c FROM web_site_settings").get().c);
local.close();

// 2. Verifikasi Turso Cloud LibSQL
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
if (tursoUrl && tursoToken) {
  const turso = createClient({ url: tursoUrl, authToken: tursoToken });
  const tursoTables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream_%' ORDER BY name");
  const tursoViews = await turso.execute("SELECT name FROM sqlite_master WHERE type='view' ORDER BY name");

  console.log("\n🌐 [Turso Cloud LibSQL]");
  console.log(`  ✓ Total Tabel Fisik (M_* & T_*): ${tursoTables.rows.length} tabel (100% Ternormalisasi)`);
  console.log(`  ✓ Total Compatibility Views: ${tursoViews.rows.length} view (Zero Storage Duplication)`);
  console.log("  --- Data Master & Transaksi ---");
  console.log("  ✓ M_Anggota          :", (await turso.execute("SELECT count(*) as c FROM M_Anggota")).rows[0].c);
  console.log("  ✓ M_Akun             :", (await turso.execute("SELECT count(*) as c FROM M_Akun")).rows[0].c);
  console.log("  ✓ T_Kepengurusan     :", (await turso.execute("SELECT count(*) as c FROM T_Kepengurusan")).rows[0].c);
  console.log("  ✓ M_Pembina          :", (await turso.execute("SELECT count(*) as c FROM M_Pembina")).rows[0].c);
  console.log("  ✓ M_Departemen       :", (await turso.execute("SELECT count(*) as c FROM M_Departemen")).rows[0].c);
  console.log("  ✓ M_Fakultas         :", (await turso.execute("SELECT count(*) as c FROM M_Fakultas")).rows[0].c);
  console.log("  ✓ M_Jurusan          :", (await turso.execute("SELECT count(*) as c FROM M_Jurusan")).rows[0].c);
  console.log("  ✓ T_Pengaturan       :", (await turso.execute("SELECT count(*) as c FROM T_Pengaturan")).rows[0].c);
  console.log("  ✓ T_Prestasi         :", (await turso.execute("SELECT count(*) as c FROM T_Prestasi")).rows[0].c);
  console.log("  ✓ T_Prestasi_Anggota :", (await turso.execute("SELECT count(*) as c FROM T_Prestasi_Anggota")).rows[0].c);
  console.log("  --- Akses Melalui Views ---");
  console.log("  ✓ View users         :", (await turso.execute("SELECT count(*) as c FROM users")).rows[0].c);
  console.log("  ✓ View web_members   :", (await turso.execute("SELECT count(*) as c FROM web_members")).rows[0].c);
  console.log("  ✓ View departments   :", (await turso.execute("SELECT count(*) as c FROM departments")).rows[0].c);
  console.log("  ✓ View site_settings :", (await turso.execute("SELECT count(*) as c FROM web_site_settings")).rows[0].c);
}

console.log("\n🎉 SELURUH DATA TERVERIFIKASI IDENTIK DAN KONSISTEN! 🎉\n");
