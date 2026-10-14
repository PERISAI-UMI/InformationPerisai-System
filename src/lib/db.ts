/**
 * db.ts — Prisma Client Singleton (Edge-safe)
 *
 * Strategi inisialisasi:
 * - PRODUCTION / EDGE (Cloudflare Workers): @prisma/adapter-libsql (pure web, zero native C++)
 *   Turso URL & token dibaca dari environment variables (wrangler secrets).
 * - DEVELOPMENT / LOCAL: Gunakan LibSQL jika TURSO_DATABASE_URL tersedia,
 *   atau better-sqlite3 secara dinamis di dalam blok else (dev only).
 *
 * ⚠️ TIDAK ADA credentials yang di-hardcode di file ini.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql/web";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const isProduction = process.env.NODE_ENV === "production";
  const tursoUrl =
    process.env.TURSO_DATABASE_URL ||
    (process.env.DATABASE_URL?.startsWith("libsql://")
      ? process.env.DATABASE_URL
      : undefined);

  // Jika di production atau ada URL Turso, gunakan adapter LibSQL Web (Edge-safe)
  if (isProduction || tursoUrl) {
    if (!tursoUrl && isProduction) {
      throw new Error(
        "[db] TURSO_DATABASE_URL wajib dikonfigurasi pada environment production / Cloudflare Workers."
      );
    }

    const adapter = new PrismaLibSql({
      url: tursoUrl || "libsql://perisai-dev-psdm.aws-ap-northeast-1.turso.io",
      authToken: process.env.TURSO_AUTH_TOKEN || undefined,
    });

    return new PrismaClient({
      adapter,
      log: isProduction ? ["error"] : ["error", "warn"],
    });
  }

  // Development / Local SQLite: dynamic require agar TIDAK di-bundle ke Cloudflare Workers
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const dbPath = (process.env.DATABASE_URL || "file:./psdm-db.db").replace(
      /^file:/,
      ""
    );
    const adapter = new PrismaBetterSqlite3({ url: dbPath });

    return new PrismaClient({
      adapter,
      log: ["error", "warn"],
    });
  } catch (error) {
    console.warn(
      "[db] Fallback better-sqlite3 gagal di lingkungan lokal, mencoba LibSQL adapter:",
      error
    );
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL || "file:./psdm-db.db",
    });
    return new PrismaClient({ adapter, log: ["error", "warn"] });
  }
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  (function () {
    const client = createPrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    return client;
  })();

export default prisma;
