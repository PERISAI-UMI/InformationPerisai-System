import test from "node:test";
import assert from "node:assert/strict";
import { GET } from "../src/app/api/health/route";

test("API Health Route Diagnostik", async (t) => {
  await t.test("Menyajikan respons status kesehatan dan checks komprehensif", async () => {
    const res = await GET();
    const data = await res.json();

    assert.equal(typeof res.status, "number");
    assert.ok(res.status === 200 || res.status === 503);

    // Verifikasi struktur data diagnostik
    assert.ok(data.status === "ok" || data.status === "degraded" || data.status === "unhealthy");
    assert.ok(data.timestamp);
    assert.equal(data.service, "UKM PERISAI UMI System");
    assert.equal(typeof data.responseTimeMs, "number");

    // Database check
    assert.ok(data.checks);
    assert.ok(data.checks.database);
    assert.ok(data.checks.database.status === "connected" || data.checks.database.status === "unreachable");
    assert.ok(data.checks.database.provider === "turso-libsql" || data.checks.database.provider === "sqlite-local");
    assert.equal(typeof data.checks.database.latencyMs, "number");

    // Storage check
    assert.ok(data.checks.storage);
    assert.equal(typeof data.checks.storage.driver, "string");
    assert.equal(typeof data.checks.storage.apiConfigured, "boolean");
    assert.ok(data.checks.storage.cdn);
    assert.equal(typeof data.checks.storage.cdn.url, "string");
    assert.ok(["accessible", "degraded", "unreachable", "skipped"].includes(data.checks.storage.cdn.status));

    // Turnstile check
    assert.ok(data.checks.turnstile);
    assert.equal(typeof data.checks.turnstile.configured, "boolean");
  });
});
