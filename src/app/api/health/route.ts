import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "unreachable";
  }

  const responseTimeMs = Date.now() - startTime;
  const isHealthy = dbStatus === "healthy";

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      service: "InformationPerisai-System",
      checks: {
        database: dbStatus,
        responseTimeMs,
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
