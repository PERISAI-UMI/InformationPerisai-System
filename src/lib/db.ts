import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/web";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url =
    process.env.TURSO_DATABASE_URL ||
    (process.env.DATABASE_URL?.startsWith("libsql://") ? process.env.DATABASE_URL : "");
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Konfigurasi @libsql/client/web untuk Cloudflare Edge Runtime
  const client = createClient({
    url: url || "file:./psdm-db.db",
    authToken: authToken || undefined,
  });

  // Bind adapter PrismaLibSql
  const adapter = new PrismaLibSql({
    url: url || "file:./psdm-db.db",
    authToken: authToken || undefined,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

