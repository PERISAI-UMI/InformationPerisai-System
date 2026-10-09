import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function importCore() {
  console.log("🚀 Memulai Impor Data Inti (Departments, Periods, Members, Statistics)...");

  const dataFile = path.join(__dirname, "legacy_export.json");
  if (!fs.existsSync(dataFile)) {
    console.warn(`⚠️ Berkas ${dataFile} tidak ditemukan. Silakan ekspor data terlebih dahulu sesuai 01-export-legacy.md.`);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

  // 1. Impor Departemen
  if (Array.isArray(rawData.departments)) {
    console.log(`📦 Mengimpor ${rawData.departments.length} Departemen...`);
    for (const d of rawData.departments) {
      await prisma.department.upsert({
        where: { slug: d.slug || String(d.id) },
        update: {
          name: d.name,
          description: d.description || null,
        },
        create: {
          name: d.name,
          slug: d.slug || String(d.id),
          description: d.description || null,
          code: d.code || null,
        },
      });
    }
  }

  // 2. Impor Periode
  if (Array.isArray(rawData.periods)) {
    console.log(`📦 Mengimpor ${rawData.periods.length} Periode...`);
    for (const p of rawData.periods) {
      await prisma.period.create({
        data: {
          name: p.name || p.year,
          isActive: Boolean(p.is_active),
          startDate: p.start_date ? new Date(p.start_date) : new Date(),
          endDate: p.end_date ? new Date(p.end_date) : null,
          vision: p.vision || null,
          mission: p.mission || null,
        },
      });
    }
  }

  // 3. Impor Statistik
  if (Array.isArray(rawData.statistics)) {
    console.log(`📦 Mengimpor ${rawData.statistics.length} Statistik...`);
    for (const s of rawData.statistics) {
      await prisma.statistic.create({
        data: {
          label: s.label || s.title,
          value: Number(s.value) || 0,
          suffix: s.suffix || null,
          isActive: s.is_active !== undefined ? Boolean(s.is_active) : true,
        },
      });
    }
  }

  console.log("✅ Impor Data Inti Selesai.");
}

importCore()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan pada impor data inti:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
