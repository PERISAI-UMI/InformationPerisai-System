import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/web";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DEFAULT_TURSO_URL = "libsql://perisai-dev-psdm.aws-ap-northeast-1.turso.io";
const DEFAULT_TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE5MDg5OTcsImlkIjoiMDFhMTE3OGQtMGIwMS03NTc4LTgzMjctYmQ3MmExMGZkYzU0Iiwia2lkIjoiYnhxbm5VQ1Vrd1U0ZzRFakJoc0xxOXo0ZHZrdlF5NXJNbHdKVGIyb0NtZyIsInJpZCI6IjEzMGZkNzhmLTAyNWMtNDQzZi04ODUxLWQ0YzkyMTFiZWNkNyJ9.FkP5L7RA1D8BHOyOM1T4qy4Lgvg119HpUa83eBX0HqXCZg_KcPzbssE3Ez7thpEFdefEmgBrkl5oQDSOzCfHDQ";

function createPrismaClient(): PrismaClient {
  let url =
    process.env.TURSO_DATABASE_URL ||
    (process.env.DATABASE_URL?.startsWith("libsql://") ? process.env.DATABASE_URL : "");
  let authToken = process.env.TURSO_AUTH_TOKEN;

  // Pastikan URL selalu menggunakan protokol yang didukung oleh @libsql/client/web
  if (!url || (!url.startsWith("libsql:") && !url.startsWith("https:") && !url.startsWith("http:"))) {
    url = DEFAULT_TURSO_URL;
    authToken = authToken || DEFAULT_TURSO_TOKEN;
  }

  // Konfigurasi @libsql/client/web untuk Cloudflare Edge Runtime
  createClient({
    url,
    authToken: authToken || undefined,
  });

  // Bind adapter PrismaLibSql
  const adapter = new PrismaLibSql({
    url,
    authToken: authToken || undefined,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Gunakan Proxy agar inisialisasi dilakukan secara lazy (tidak crash saat worker bootstrap)
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const val = (client as any)[prop];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});

export default prisma;


