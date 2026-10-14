import { cache } from "react";
import prisma from "@/lib/db";

export const getPublicSettings = cache(async function getPublicSettings(): Promise<Record<string, string>> {
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
    return record;
  } catch (err) {
    console.error("Error fetching public settings:", err);
    return {};
  }
});
