import prisma from "@/lib/db";

export async function getAdminOpportunities({ page = 1, pageSize = 15 } = {}) {
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.opportunity.findMany({
      skip,
      take: pageSize,
      orderBy: { deadlineAt: "desc" },
    }),
    prisma.opportunity.count(),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminOpportunityById(id: string) {
  return prisma.opportunity.findUnique({
    where: { id },
  });
}
