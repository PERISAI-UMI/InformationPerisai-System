import prisma from "@/lib/db";

export async function getAdminPeriods() {
  return prisma.period.findMany({
    orderBy: { startDate: "desc" },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });
}

export async function getAdminPeriodById(id: string) {
  return prisma.period.findUnique({
    where: { id },
  });
}

export async function getActivePeriod() {
  return prisma.period.findFirst({
    where: { isCurrent: 1 },
  });
}
