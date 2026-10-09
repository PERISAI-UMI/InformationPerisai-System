import Database from "better-sqlite3";
import { createClient } from "@libsql/client";

const local = new Database("psdm-db.db");
const localTables = local.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
console.log("✅ Local SQLite Total Tables:", localTables.length);
console.log("   M_Anggota:", local.prepare("SELECT count(*) as c FROM M_Anggota").get().c);
console.log("   T_Kepengurusan:", local.prepare("SELECT count(*) as c FROM T_Kepengurusan").get().c);
console.log("   users:", local.prepare("SELECT count(*) as c FROM users").get().c);
console.log("   departments:", local.prepare("SELECT count(*) as c FROM departments").get().c);
console.log("   web_site_settings:", local.prepare("SELECT count(*) as c FROM web_site_settings").get().c);
console.log("   web_members:", local.prepare("SELECT count(*) as c FROM web_members").get().c);
local.close();

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
if (tursoUrl && tursoToken) {
  const turso = createClient({ url: tursoUrl, authToken: tursoToken });
  const tursoTables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream_%' ORDER BY name");
  console.log("✅ Turso Cloud Total Tables:", tursoTables.rows.length);
  console.log("   M_Anggota:", (await turso.execute("SELECT count(*) as c FROM M_Anggota")).rows[0].c);
  console.log("   T_Kepengurusan:", (await turso.execute("SELECT count(*) as c FROM T_Kepengurusan")).rows[0].c);
  console.log("   users:", (await turso.execute("SELECT count(*) as c FROM users")).rows[0].c);
  console.log("   departments:", (await turso.execute("SELECT count(*) as c FROM departments")).rows[0].c);
  console.log("   web_site_settings:", (await turso.execute("SELECT count(*) as c FROM web_site_settings")).rows[0].c);
  console.log("   web_members:", (await turso.execute("SELECT count(*) as c FROM web_members")).rows[0].c);
}
