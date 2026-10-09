import prisma from "@/lib/db";

export async function getAdminStatistics() {
  return prisma.statistic.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAdminStatisticById(id: string) {
  return prisma.statistic.findUnique({
    where: { id },
  });
}
