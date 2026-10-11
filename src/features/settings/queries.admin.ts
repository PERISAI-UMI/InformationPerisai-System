import prisma from "@/lib/db";

export async function getAdminSettings() {
  const rows = await prisma.tPengaturan.findMany({
    orderBy: { kunci: "asc" },
  });
  return rows.map((r) => ({
    key: r.kunci,
    value: r.nilai,
    updatedBy: r.diperbaruiOleh,
    updatedAt: r.updatedAt,
  }));
}
