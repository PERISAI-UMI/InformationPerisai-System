import { LocalStorageDriver } from "./local";
import { S3StorageDriver } from "./s3";

export interface StorageDriver {
  upload(
    file: Buffer | Uint8Array,
    filename: string,
    mimeType?: string
  ): Promise<{ url: string; path: string }>;
  delete(path: string): Promise<boolean>;
}

export function getStorageDriver(): StorageDriver {
  const driver = (process.env.STORAGE_DRIVER || "").toLowerCase();
  if (driver === "s3" || driver === "r2") {
    return new S3StorageDriver();
  }
  return new LocalStorageDriver();
}

export const storage = getStorageDriver();

