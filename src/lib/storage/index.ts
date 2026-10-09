import { LocalStorageDriver } from "./local";
import { S3StorageDriver } from "./s3";

export interface StorageDriver {
  upload(file: Buffer, filename: string, mimeType?: string): Promise<{ url: string; path: string }>;
  delete(path: string): Promise<boolean>;
}

export function getStorageDriver(): StorageDriver {
  const driver = process.env.STORAGE_DRIVER;
  if (driver === "s3") {
    return new S3StorageDriver();
  }
  return new LocalStorageDriver();
}

export const storage = getStorageDriver();
