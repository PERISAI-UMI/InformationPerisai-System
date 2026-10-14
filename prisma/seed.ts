import prisma from "../src/lib/db";

async function main() {
  console.log("🌱 Menjalankan seed data awal website...");
  const now = Math.floor(Date.now() / 1000);

  // 1. Seed Periode Aktif di M_Periode (model: mPeriode)
  const activePeriod = await prisma.mPeriode.findFirst({
    where: { isActive: 1 },
  });

  if (!activePeriod) {
    const period = await prisma.mPeriode.create({
      data: {
        namaPeriode: "Periode 2025/2026",
        tahunMulai: 2025,
        tahunSelesai: 2026,
        isActive: 1,
      },
    });
    console.log(`✅ Dibuat periode aktif: ${period.namaPeriode}`);
  } else {
    console.log(`ℹ️ Periode aktif sudah ada: ${activePeriod.namaPeriode}`);
  }

  // 2. Seed Pengaturan Website di T_Pengaturan (model: tPengaturan)
  const defaultSettings = [
    { key: "site_name", value: "UKM PERISAI UMI" },
    {
      key: "site_tagline",
      value: "Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia",
    },
    { key: "contact_email", value: "ukmperisai@umi.ac.id" },
    { key: "contact_phone", value: "+62 812-3456-7890" },
    { key: "current_generasi", value: "11" },
    {
      key: "address",
      value:
        "GOR UMI Ruangan No. 10, Kampus II UMI, Jl. Urip Sumoharjo Km. 5, Makassar",
    },
    { key: "instagram_url", value: "https://instagram.com/ukmperisai_umi" },
  ];

  for (const s of defaultSettings) {
    await prisma.tPengaturan.upsert({
      where: { kunci: s.key },
      update: {},
      create: {
        kunci: s.key,
        nilai: s.value,
        tipe: "string",
        updatedAt: now,
      },
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

