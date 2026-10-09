import prisma from "@/lib/db";

export async function getPublicStatistics() {
  const stats = await prisma.statistic.findMany({
    where: { isActive: 1 },
    orderBy: { sortOrder: "asc" },
  });

  return stats.map((s: (typeof stats)[number]) => ({
    id: s.id,
    label: s.label,
    value: s.value,
    description: s.description,
    orderIndex: s.sortOrder,
    isActive: Boolean(s.isActive),
  }));
}
