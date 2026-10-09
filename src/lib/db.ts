import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const tursoUrl =
    process.env.TURSO_DATABASE_URL ||
    (process.env.DATABASE_URL?.startsWith("libsql://") ? process.env.DATABASE_URL : undefined);
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  let adapter;
  if (tursoUrl && tursoAuthToken) {
    adapter = new PrismaLibSql({
      url: tursoUrl,
      authToken: tursoAuthToken,
    });
  } else {
    const dbPath = path.resolve(process.cwd(), "psdm-db.db");
    adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  }

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
