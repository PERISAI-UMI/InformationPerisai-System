import prisma from "@/lib/db";

export async function getAdminPosts({ page = 1, pageSize = 15, search = "" } = {}) {
  const skip = (page - 1) * pageSize;
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { excerpt: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        department: { select: { nama: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      department: { select: { nama: true } },
    },
  });
}
