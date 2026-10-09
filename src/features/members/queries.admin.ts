import prisma from "@/lib/db";

export async function getAdminMembers({ periodId }: { periodId?: string } = {}) {
  const where = periodId ? { periodId } : {};

  const members = await prisma.member.findMany({
    where,
    include: {
      department: true,
      period: true,
    },
    orderBy: [{ period: { startDate: "desc" } }, { sortOrder: "asc" }],
  });

  return members.map((m) => ({
    ...m,
    avatarUrl: m.photoMediaId,
    roleOrTitle: m.position,
    orderIndex: m.sortOrder,
    isActive: Boolean(m.isActive),
  }));
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
