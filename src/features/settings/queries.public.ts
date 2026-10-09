import prisma from "@/lib/db";

export async function getPublicSettings(): Promise<Record<string, string>> {
  const settings = await prisma.setting.findMany();

  const record: Record<string, string> = {};
  for (const s of settings) {
    if (s.value !== null) {
      record[s.key] = s.value;
    }
  }
  return record;
}
