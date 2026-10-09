import prisma from "@/lib/db";

export async function getAdminWorkPrograms({ page = 1, pageSize = 15 } = {}) {
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.workProgram.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        department: { select: { nama: true } },
      },
    }),
    prisma.workProgram.count(),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminWorkProgramById(id: string) {
  return prisma.workProgram.findUnique({
    where: { id },
    include: {
      department: true,
      images: {
        include: { media: true },
      },
    },
  });
}
