import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function verifyMigration() {
  console.log("🔍 Memulai Verifikasi Data Hasil Migrasi...");

  const dataFile = path.join(__dirname, "legacy_export.json");
  let legacyCounts: Record<string, number> = {};

  if (fs.existsSync(dataFile)) {
    const rawData = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    legacyCounts = {
      departments: rawData.departments?.length || 0,
      periods: rawData.periods?.length || 0,
      members: rawData.members?.length || 0,
      news: rawData.news?.length || 0,
      competitions: rawData.competitions?.length || 0,
      work_programs: rawData.work_programs?.length || 0,
      statistics: rawData.statistics?.length || 0,
    };
  }

  const [
    deptCount,
    periodCount,
    memberCount,
    postCount,
    opportunityCount,
    prokerCount,
    statCount,
    mediaCount,
  ] = await Promise.all([
    prisma.department.count(),
    prisma.period.count(),
    prisma.member.count(),
    prisma.post.count(),
    prisma.opportunity.count(),
    prisma.workProgram.count(),
    prisma.statistic.count(),
    prisma.media.count(),
  ]);

  console.log("\n================ REKAPITULASI DATA ================");
  console.log(`Departemen     : DB Baru = ${deptCount} | Legacy = ${legacyCounts.departments ?? "-"}`);
  console.log(`Periode        : DB Baru = ${periodCount} | Legacy = ${legacyCounts.periods ?? "-"}`);
  console.log(`Anggota        : DB Baru = ${memberCount} | Legacy = ${legacyCounts.members ?? "-"}`);
  console.log(`Postingan      : DB Baru = ${postCount} | Legacy = ${legacyCounts.news ?? "-"}`);
  console.log(`Peluang/Lomba  : DB Baru = ${opportunityCount} | Legacy = ${legacyCounts.competitions ?? "-"}`);
  console.log(`Program Kerja  : DB Baru = ${prokerCount} | Legacy = ${legacyCounts.work_programs ?? "-"}`);
  console.log(`Statistik      : DB Baru = ${statCount} | Legacy = ${legacyCounts.statistics ?? "-"}`);
  console.log(`Media Terdaftar: DB Baru = ${mediaCount}`);
  console.log("===================================================\n");

  console.log("✅ Verifikasi data selesai.");
}

verifyMigration()
  .catch((e) => {
    console.error("❌ Kesalahan saat verifikasi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
