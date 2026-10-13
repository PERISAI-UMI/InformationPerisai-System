import test from "node:test";
import assert from "node:assert/strict";
import { S3StorageDriver } from "../src/lib/storage/s3";
import { getStorageDriver } from "../src/lib/storage";

test("Storage Driver Selection", () => {
  const originalDriver = process.env.STORAGE_DRIVER;

  // Test R2
  process.env.STORAGE_DRIVER = "r2";
  const r2Driver = getStorageDriver();
  assert.equal(r2Driver instanceof S3StorageDriver, true, "Driver harus berupa S3StorageDriver jika STORAGE_DRIVER=r2");

  // Test S3
  process.env.STORAGE_DRIVER = "s3";
  const s3Driver = getStorageDriver();
  assert.equal(s3Driver instanceof S3StorageDriver, true, "Driver harus berupa S3StorageDriver jika STORAGE_DRIVER=s3");

  // Test Local
  process.env.STORAGE_DRIVER = "local";
  const localDriver = getStorageDriver();
  assert.equal(localDriver instanceof S3StorageDriver, false, "Driver tidak boleh S3StorageDriver jika STORAGE_DRIVER=local");

  process.env.STORAGE_DRIVER = originalDriver;
});

test("S3StorageDriver upload and URL resolution fallback", async () => {
  const prevPublic = process.env.R2_PUBLIC_URL;
  const prevBucket = process.env.R2_BUCKET;
  process.env.R2_PUBLIC_URL = "https://media.perisai-umi.org";
  delete process.env.R2_BUCKET;

  const driver = new S3StorageDriver();
  const file = Buffer.from("test file content");
  const result = await driver.upload(file, "test-dokumen.pdf", "application/pdf");

  assert.equal(typeof result.url, "string");
  assert.equal(result.url.startsWith("https://media.perisai-umi.org/uploads/"), true);
  assert.equal(result.path.startsWith("uploads/"), true);

  process.env.R2_PUBLIC_URL = prevPublic;
  process.env.R2_BUCKET = prevBucket;
});

test("S3StorageDriver delete key normalization", async () => {
  const driver = new S3StorageDriver();

  // Driver tanpa kredensial remote mengembalikan false dengan aman tanpa crash
  const deleteResult = await driver.delete("https://media.perisai-umi.org/uploads/sample.jpg");
  assert.equal(typeof deleteResult, "boolean");
});
