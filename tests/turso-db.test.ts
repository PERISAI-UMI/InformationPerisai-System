import test from "node:test";
import assert from "node:assert/strict";
import { validateEnv } from "../src/lib/env";

test("Turso and Storage Environment Configuration", () => {
  const originalTurso = process.env.TURSO_DATABASE_URL;
  const originalDriver = process.env.STORAGE_DRIVER;

  process.env.TURSO_DATABASE_URL = "libsql://perisai-dev-psdm.aws-ap-northeast-1.turso.io";
  process.env.STORAGE_DRIVER = "r2";

  const config = validateEnv();

  assert.equal(config.tursoUrl, "libsql://perisai-dev-psdm.aws-ap-northeast-1.turso.io");
  assert.equal(config.storageDriver, "r2");

  process.env.TURSO_DATABASE_URL = originalTurso;
  process.env.STORAGE_DRIVER = originalDriver;
});
