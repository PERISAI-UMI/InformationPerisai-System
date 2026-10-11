import prisma from "@/lib/db";

export async function getAdminUsers({ page = 1, pageSize = 8 }: { page?: number; pageSize?: number } = {}) {
  const skip = (page - 1) * pageSize;

  const [akuns, total] = await Promise.all([
    prisma.mAkun.findMany({
      include: {
        anggota: true,
        role: true,
      },
      skip,
      take: pageSize,
    }),
    prisma.mAkun.count(),
  ]);

  const items = akuns.map((u) => ({
    id: u.idPerisai,
    name: u.anggota.namaLengkap,
    email: u.anggota.email,
    role: u.role.namaRole,
    isActive: Boolean(u.isActive),
    createdAt: new Date(u.createdAt * 1000).toISOString(),
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
  const u = await prisma.mAkun.findUnique({
    where: { idPerisai: id },
    include: {
      anggota: true,
      role: true,
    },
  });

  if (!u) return null;

  return {
    id: u.idPerisai,
    name: u.anggota.namaLengkap,
    email: u.anggota.email,
    role: u.role.namaRole,
    isActive: Boolean(u.isActive),
    createdAt: new Date(u.createdAt * 1000).toISOString(),
    _count: { posts: 0, uploadedMedia: 0 },
  };
}
