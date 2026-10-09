import prisma from "../src/lib/db";

async function main() {
  console.log("🌱 Menjalankan seed data awal website...");
  const now = Math.floor(Date.now() / 1000);

  // 1. Seed Periode Aktif di web_periods
  const activePeriod = await prisma.period.findFirst({
    where: { isCurrent: 1 },
  });

  if (!activePeriod) {
    const period = await prisma.period.create({
      data: {
        name: "Periode 2025/2026",
        startDate: Math.floor(new Date("2025-01-01").getTime() / 1000),
        isCurrent: 1,
      },
    });
    console.log(`✅ Dibuat periode aktif: ${period.name}`);
  }

  // 2. Seed Pengaturan Website (web_site_settings)
  const defaultSettings = [
    { key: "site_name", value: "UKM PERISAI UMI" },
    { key: "site_tagline", value: "Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia" },
    { key: "contact_email", value: "ukmperisai@umi.ac.id" },
    { key: "contact_phone", value: "+62 812-3456-7890" },
    { key: "current_generasi", value: "11" },
    { key: "address", value: "Gedung Menara UMI Lt. 4, Kampus II UMI, Jl. Urip Sumoharjo Km. 5, Makassar" },
    { key: "instagram_url", value: "https://instagram.com/ukmperisai_umi" },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, value: s.value, updatedAt: now },
    });
  }
  console.log("✅ Dikonfigurasi pengaturan dasar situs.");
}

main()
  .catch((e) => {
    console.error("❌ Error running seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
