import { PrismaClient, PostStatus, OpportunityCategory, WorkProgramStatus } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function importContent() {
  console.log("🚀 Memulai Impor Konten (News -> Posts, Competitions -> Opportunities, Work Programs)...");

  const dataFile = path.join(__dirname, "legacy_export.json");
  if (!fs.existsSync(dataFile)) {
    console.warn(`⚠️ Berkas ${dataFile} tidak ditemukan. Silakan jalankan ekspor terlebih dahulu.`);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  const defaultAdmin = await prisma.user.findFirst();

  if (!defaultAdmin) {
    console.error("❌ Tidak ada user admin di database. Jalankan 'npx prisma db seed' terlebih dahulu.");
    return;
  }

  // 1. News -> Posts
  if (Array.isArray(rawData.news)) {
    console.log(`📦 Mengimpor ${rawData.news.length} Berita (News -> Posts)...`);
    for (const n of rawData.news) {
      await prisma.post.upsert({
        where: { slug: n.slug || `post-${n.id}` },
        update: {},
        create: {
          title: n.title,
          slug: n.slug || `post-${n.id}`,
          content: n.content || n.body || "",
          excerpt: n.excerpt || null,
          coverImageUrl: n.image || n.thumbnail || null,
          status: n.status === "published" || n.is_published ? PostStatus.PUBLISHED : PostStatus.DRAFT,
          authorId: defaultAdmin.id,
          publishedAt: n.published_at ? new Date(n.published_at) : new Date(n.created_at || Date.now()),
        },
      });
    }
  }

  // 2. Competitions -> Opportunities
  if (Array.isArray(rawData.competitions)) {
    console.log(`📦 Mengimpor ${rawData.competitions.length} Kompetisi (Competitions -> Opportunities)...`);
    for (const c of rawData.competitions) {
      await prisma.opportunity.upsert({
        where: { slug: c.slug || `opportunity-${c.id}` },
        update: {},
        create: {
          title: c.title || c.name,
          slug: c.slug || `opportunity-${c.id}`,
          organizer: c.organizer || "Penyelenggara Eksternal",
          description: c.description || "",
          requirements: c.requirements || null,
          linkUrl: c.link || c.url || null,
          deadlineAt: c.deadline_at ? new Date(c.deadline_at) : new Date(Date.now() + 30 * 86400000),
          category: OpportunityCategory.LOMBA,
          coverImageUrl: c.image || null,
        },
      });
    }
  }

  // 3. Work Programs
  if (Array.isArray(rawData.work_programs)) {
    console.log(`📦 Mengimpor ${rawData.work_programs.length} Program Kerja...`);
    const defaultPeriod = await prisma.period.findFirst({ where: { isActive: true } });
    const defaultDept = await prisma.department.findFirst();

    if (defaultPeriod && defaultDept) {
      for (const wp of rawData.work_programs) {
        await prisma.workProgram.upsert({
          where: { slug: wp.slug || `proker-${wp.id}` },
          update: {},
          create: {
            name: wp.name || wp.title,
            slug: wp.slug || `proker-${wp.id}`,
            departmentId: defaultDept.id,
            periodId: defaultPeriod.id,
            description: wp.description || "",
            status: WorkProgramStatus.COMPLETED,
          },
        });
      }
    }
  }

  console.log("✅ Impor Konten Selesai.");
}

importContent()
  .catch((e) => {
    console.error("❌ Kesalahan saat impor konten:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
