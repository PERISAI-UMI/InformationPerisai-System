import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function importMedia() {
  console.log("🚀 Memulai Migrasi Media dari Laravel Legacy...");

  const sourceDir = path.join(__dirname, "legacy_media");
  const targetDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (!fs.existsSync(sourceDir)) {
    console.warn(`⚠️ Direktori media lama (${sourceDir}) tidak ditemukan. Buat direktori dan tempatkan berkas media lama di sana.`);
    return;
  }

  const files = fs.readdirSync(sourceDir);
  console.log(`📦 Ditemukan ${files.length} berkas media untuk disalin.`);

  for (const file of files) {
    const srcFile = path.join(sourceDir, file);
    const stat = fs.statSync(srcFile);

    if (stat.isFile()) {
      const destFile = path.join(targetDir, file);
      fs.copyFileSync(srcFile, destFile);

      const mimeType = file.endsWith(".png")
        ? "image/png"
        : file.endsWith(".webp")
        ? "image/webp"
        : file.endsWith(".svg")
        ? "image/svg+xml"
        : "image/jpeg";

      await prisma.media.create({
        data: {
          filename: file,
          originalName: file,
          mimeType,
          size: stat.size,
          url: `/uploads/${file}`,
          path: `public/uploads/${file}`,
          driver: "local",
        },
      });
      console.log(`  ✓ Tersalin & tercatat: ${file}`);
    }
  }

  console.log("✅ Migrasi Media Selesai.");
}

importMedia()
  .catch((e) => {
    console.error("❌ Kesalahan saat migrasi media:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
