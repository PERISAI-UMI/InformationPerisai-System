import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const overallStart = Date.now();

  // 1. Diagnostik Basis Data (Turso LibSQL / SQLite)
  const dbStart = Date.now();
  let dbStatus: "connected" | "unreachable" = "connected";
  let dbServerTime: string | null = null;
  let dbError: string | null = null;

  const isTurso = Boolean(
    process.env.TURSO_DATABASE_URL ||
      process.env.DATABASE_URL?.startsWith("libsql://")
  );

  try {
    const rawResult = await prisma.$queryRaw<Array<{ ping: number; server_time: string }>>`
      SELECT 1 as ping, datetime('now') as server_time;
    `;
    dbServerTime = rawResult[0]?.server_time || null;
  } catch (err) {
    dbStatus = "unreachable";
    dbError = err instanceof Error ? err.message : String(err);
  }
  const dbLatencyMs = Date.now() - dbStart;

  // 2. Diagnostik Penyimpanan Media (Cloudflare R2 CDN & API)
  const storageDriver = (process.env.STORAGE_DRIVER || "r2").toLowerCase();
  const mediaDomain =
    process.env.R2_PUBLIC_URL || "https://media.perisai-umi.org";
  const isR2CredentialsConfigured = Boolean(
    (process.env.R2_ENDPOINT || process.env.S3_ENDPOINT) &&
      (process.env.R2_BUCKET || process.env.S3_BUCKET) &&
      (process.env.R2_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID) &&
      (process.env.R2_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY)
  );

  let cdnStatus: "accessible" | "degraded" | "unreachable" | "skipped" =
    "accessible";
  let cdnLatencyMs = 0;
  let cdnHttpStatus: number | null = null;

  if (mediaDomain.startsWith("http://") || mediaDomain.startsWith("https://")) {
    const cdnStart = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const cdnRes = await fetch(mediaDomain, {
        method: "HEAD",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      cdnHttpStatus = cdnRes.status;
      cdnLatencyMs = Date.now() - cdnStart;

      // Status 200, 403, atau 404 dari Cloudflare R2 bucket root menandakan DNS & SSL CDN aktif
      if (cdnRes.status >= 200 && cdnRes.status < 500) {
        cdnStatus = "accessible";
      } else {
        cdnStatus = "degraded";
      }
    } catch {
      cdnLatencyMs = Date.now() - cdnStart;
      // Di lokal offline, CDN mungkin tidak dapat diakses tanpa koneksi internet
      cdnStatus = process.env.NODE_ENV === "production" ? "unreachable" : "degraded";
    }
  } else {
    cdnStatus = "skipped";
  }

  // 3. Status Turnstile Anti-Bot
  const isTurnstileConfigured = Boolean(
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
      process.env.TURNSTILE_SECRET_KEY
  );

  const totalResponseTimeMs = Date.now() - overallStart;
  const isDbHealthy = dbStatus === "connected";
  const isOverallHealthy = isDbHealthy && cdnStatus !== "unreachable";

  const overallStatus = isOverallHealthy
    ? "ok"
    : isDbHealthy
    ? "degraded"
    : "unhealthy";

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      service: "UKM PERISAI UMI System",
      environment: process.env.NODE_ENV || "development",
      runtime: process.env.NEXT_RUNTIME === "edge" ? "edge" : "nodejs",
      responseTimeMs: totalResponseTimeMs,
      checks: {
        database: {
          status: dbStatus,
          provider: isTurso ? "turso-libsql" : "sqlite-local",
          latencyMs: dbLatencyMs,
          serverTime: dbServerTime,
          ...(dbError && { error: dbError }),
        },
        storage: {
          driver: storageDriver,
          apiConfigured: isR2CredentialsConfigured,
          cdn: {
            url: mediaDomain,
            status: cdnStatus,
            latencyMs: cdnLatencyMs,
            httpStatus: cdnHttpStatus,
          },
        },
        turnstile: {
          configured: isTurnstileConfigured,
        },
      },
    },
    { status: isDbHealthy ? 200 : 503 }
  );
}
