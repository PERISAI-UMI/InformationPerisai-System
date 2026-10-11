import prisma from "@/lib/db";

export async function getPublicSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.tPengaturan.findMany();

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
}
