import { cache } from "react";
import prisma from "@/lib/db";

let cachedSettings: { data: Record<string, string>; expiresAt: number } | null = null;
const TTL_MS = 5 * 60 * 1000; // 5 menit

export function invalidateSettingsCache(): void {
  cachedSettings = null;
}

export const getPublicSettings = cache(async function getPublicSettings(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cachedSettings && cachedSettings.expiresAt > now) {
    return cachedSettings.data;
  }

  try {
    const settings = await prisma.tPengaturan.findMany({
      select: {
        kunci: true,
        nilai: true,
      },
    });

    const record: Record<string, string> = {};
    for (const s of settings) {
      if (s.nilai !== null) {
        record[s.kunci] = s.nilai;
      }
    }

    cachedSettings = { data: record, expiresAt: now + TTL_MS };
    return record;
  } catch (err) {
    console.error("Error fetching public settings:", err);
    return cachedSettings?.data || {};
  }
});
