import prisma from "@/lib/db";

export async function getAdminUsers({ page = 1, pageSize = 8 }: { page?: number; pageSize?: number } = {}) {
  const skip = (page - 1) * pageSize;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        role: true,
        cmsAccess: {
          select: { cmsRole: true },
        },
      },
      orderBy: { namaLengkap: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.user.count(),
  ]);

  const items = users.map((u) => ({
    id: u.id,
    name: u.namaLengkap,
    email: u.email,
    role: u.cmsAccess?.cmsRole || (u.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : u.role === "ADMIN" ? "ADMIN" : "EDITOR"),
    isActive: true,
    createdAt: new Date().toISOString(),
    _count: { posts: 0, uploadedMedia: 0 },
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminUserById(id: string) {
  const u = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      role: true,
      cmsAccess: {
        select: { cmsRole: true },
      },
    },
  });

  if (!u) return null;

  return {
    id: u.id,
    name: u.namaLengkap,
    email: u.email,
    role: u.cmsAccess?.cmsRole || (u.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "EDITOR"),
    isActive: true,
  };
}
