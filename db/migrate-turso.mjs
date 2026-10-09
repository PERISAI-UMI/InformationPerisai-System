import { createClient } from "@libsql/client";
import fs from "fs";

const url = "libsql://perisai-dev-psdm.aws-ap-northeast-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTEzOTY1MzMsImlkIjoiMDFhMTE3OGQtMGIwMS03NTc4LTgzMjctYmQ3MmExMGZkYzU0Iiwia2lkIjoiYnhxbm5VQ1Vrd1U0ZzRFakJoc0xxOXo0ZHZrdlF5NXJNbHdKVGIyb0NtZyIsInJpZCI6IjEzMGZkNzhmLTAyNWMtNDQzZi04ODUxLWQ0YzkyMTFiZWNkNyJ9.jB-8X5V7nHjl5IsTnc1ZmTR1jhaZG6MGayuNJmWrqBe7K4FiPQeRSjr32oKoNhCIVPCAfeY-MChdvwfQH26mDg";

const client = createClient({ url, authToken });

async function migrate() {
  console.log("🚀 Applying web_* migrations to Turso...");
  const sql = fs.readFileSync("db/migrations/001_create_web_tables.sql", "utf8");
  
  // Remove line comments first
  const cleanSql = sql
    .split("\n")
    .map(line => line.trim().startsWith("--") ? "" : line)
    .join("\n");

  const statements = cleanSql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    await client.execute(stmt);
  }
  console.log(`✅ Applied ${statements.length} migration statements.`);

  // Verify created tables
  const tablesRes = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'web_%' ORDER BY name");
  console.log("Created web_* tables:", tablesRes.rows.map(r => r.name));

  // Seed default data if empty
  console.log("🌱 Seeding web_* initial data into Turso...");
  const now = Math.floor(Date.now() / 1000);

  // 1. Department Profiles
  const deptsRes = await client.execute("SELECT id, nama FROM departments");
  const slugMap = {
    "Hubungan Masyarakat (HUMAS)": { slug: "humas", desc: "Menjalin relasi strategis, kemitraan lembaga, dan publikasi citra organisasi." },
    "Kompetisi dan Prestasi (KOMPRES)": { slug: "kompres", desc: "Mewadahi bimbingan perlombaan ilmiah, delegasi kompetisi, dan rekognisi prestasi." },
    "Media": { slug: "media", desc: "Pusat kreasi visual, dokumentasi kegiatan, dan pengelolaan kanal digital." },
    "Penalaran": { slug: "penalaran", desc: "Pengembangan budaya berpikir kritis, kajian ilmiah, dan forum diskusi akademis." },
    "Pengembangan Sumber Daya Manusia (PSDM)": { slug: "psdm", desc: "Kaderisasi, pengembangan kepemimpinan, dan kesejahteraan seluruh fungsionaris." },
    "Riset dan Teknologi (RISTEK)": { slug: "ristek", desc: "Pusat inovasi rekayasa teknologi, penelitian terapan, dan hilirisasi karya riset." },
    "Trisula": { slug: "trisula", desc: "Garda khusus pengembangan riset strategis dan pengawalan prestasi unggulan." }
  };

  let sortOrder = 1;
  for (const dept of deptsRes.rows) {
    const info = slugMap[dept.nama] || { slug: dept.nama.toLowerCase().replace(/[^a-z0-9]/g, "-"), desc: dept.nama };
    await client.execute({
      sql: `INSERT OR IGNORE INTO web_department_profiles 
            (department_id, slug, short_description, description, sort_order, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      args: [dept.id, info.slug, info.desc, info.desc, sortOrder++, now, now]
    });
  }
  console.log("✅ Seeded web_department_profiles");

  // 2. Site settings
  const settings = [
    { key: "site_name", value: "UKM PERISAI UMI" },
    { key: "site_tagline", value: "Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia" },
    { key: "current_generasi", value: "11" },
    { key: "contact_email", value: "ukmperisai@umi.ac.id" },
    { key: "contact_phone", value: "+62 812-3456-7890" },
    { key: "address", value: "Gedung Menara UMI Lt. 4, Kampus II UMI, Jl. Urip Sumoharjo Km. 5, Makassar" },
    { key: "instagram_url", value: "https://instagram.com/ukmperisai_umi" },
    { key: "history_content", value: "UKM PERISAI UMI didirikan sebagai wadah mahasiswa penggerak riset dan keilmiahan di Universitas Muslim Indonesia." }
  ];

  for (const s of settings) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO web_site_settings (key, value, updated_at) VALUES (?, ?, ?)`,
      args: [s.key, s.value, now]
    });
  }
  console.log("✅ Seeded web_site_settings");

  // 3. Periods
  await client.execute({
    sql: `INSERT OR IGNORE INTO web_periods (id, name, start_date, is_current) VALUES ('period-2025-2026', 'Periode 2025/2026', ?, 1)`,
    args: [Math.floor(new Date("2025-01-01").getTime() / 1000)]
  });
  console.log("✅ Seeded web_periods");

  // 4. Statistics
  const stats = [
    { id: "stat-1", label: "Pengurus Aktif", value: "39+", desc: "Fungsionaris Generasi 11", order: 1 },
    { id: "stat-2", label: "Departemen", value: "7", desc: "Pilar bidang keilmuan", order: 2 },
    { id: "stat-3", label: "Prestasi Ilmiah", value: "50+", desc: "Tingkat nasional & regional", order: 3 },
    { id: "stat-4", label: "Proker Berjalan", value: "15+", desc: "Agenda riset & pelatihan", order: 4 }
  ];

  for (const st of stats) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO web_statistics (id, label, value, description, sort_order, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      args: [st.id, st.label, st.value, st.desc, st.order, now, now]
    });
  }
  console.log("✅ Seeded web_statistics");

  // 5. Dewan Pembina
  await client.execute({
    sql: `INSERT OR IGNORE INTO web_extra_people (id, name, position, tier, sort_order, is_active, created_at, updated_at)
          VALUES ('pembina-1', 'Dr. Ir. Pembina Riset UMI, M.T.', 'Dewan Pembina UKM PERISAI UMI', 'pembina', 1, 1, ?, ?)`,
    args: [now, now]
  });
  console.log("✅ Seeded web_extra_people");

  // 6. User Access for SUPER_ADMIN users in Turso
  const superAdmins = await client.execute("SELECT id FROM users WHERE role = 'SUPER_ADMIN'");
  for (const u of superAdmins.rows) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO web_user_access (user_id, cms_role, created_at, updated_at) VALUES (?, 'super_admin', ?, ?)`,
      args: [u.id, now, now]
    });
  }
  console.log(`✅ Granted CMS super_admin access to ${superAdmins.rows.length} SUPER_ADMIN users.`);

  console.log("🎉 Turso database migration & initial setup complete!");
}

migrate().catch(console.error);
