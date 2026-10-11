import prisma from "@/lib/db";

export async function getAdminMembers({
  periodId,
  page = 1,
  pageSize = 8,
}: {
  periodId?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where = periodId ? { periodId } : {};
  const skip = (page - 1) * pageSize;

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      include: {
        department: true,
        period: true,
      },
      orderBy: [{ period: { startDate: "desc" } }, { sortOrder: "asc" }],
      skip,
      take: pageSize,
    }),
    prisma.member.count({ where }),
  ]);

  const items = members.map((m) => ({
    ...m,
    avatarUrl: m.photoMediaId,
    roleOrTitle: m.position,
    orderIndex: m.sortOrder,
    isActive: Boolean(m.isActive),
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminMemberById(id: string) {
  const m = await prisma.member.findUnique({
    where: { id },
    include: {
      department: true,
      period: true,
    },
  });

  if (!m) return null;

  return {
    ...m,
    avatarUrl: m.photoMediaId,
    roleOrTitle: m.position,
    orderIndex: m.sortOrder,
    isActive: Boolean(m.isActive),
  };
}
