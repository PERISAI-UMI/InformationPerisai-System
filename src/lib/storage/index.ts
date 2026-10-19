/**
 * storage/index.ts — Storage Driver Factory (Edge-safe)
 *
 * Memilih driver penyimpanan berdasarkan:
 * - STORAGE_DRIVER env var: "r2" | "s3" | "local"
 * - Di edge runtime (Cloudflare Workers), selalu gunakan S3/R2,
 *   karena filesystem lokal tidak tersedia.
 */

import { S3StorageDriver } from "./s3";

export interface StorageDriver {
  upload(
    file: Buffer | Uint8Array,
    filename: string,
    mimeType?: string
  ): Promise<{ url: string; path: string }>;
  delete(path: string): Promise<boolean>;
}

/** Apakah runtime saat ini adalah Cloudflare Workers / edge */
function isEdgeRuntime(): boolean {
  return (
    typeof (globalThis as unknown as { WebSocketPair?: unknown }).WebSocketPair !== "undefined" ||
    process.env.NEXT_RUNTIME === "edge" ||
    process.env.NODE_ENV === "production"
  );
}

export function getStorageDriver(): StorageDriver {
  const driver = (process.env.STORAGE_DRIVER || "r2").toLowerCase();

  // Di edge runtime, local filesystem tidak tersedia — paksa ke S3/R2
  if (driver === "local" && !isEdgeRuntime()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { LocalStorageDriver } = require("./local");
      return new LocalStorageDriver();
    } catch {
      return new S3StorageDriver();
    }
  }

  // Default: S3/R2 (untuk edge dan production)
  return new S3StorageDriver();
}

export const storage = getStorageDriver();

