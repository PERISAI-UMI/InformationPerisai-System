import prisma from "@/lib/db";

export async function getAdminPosts({ page = 1, pageSize = 8, search = "" } = {}) {
  const skip = (page - 1) * pageSize;
  const where = search
    ? {
        OR: [
          { judul: { contains: search } },
          { ringkasan: { contains: search } },
        ],
      }
    : {};

  const [rawItems, total] = await Promise.all([
    prisma.tBerita.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        departemen: { select: { namaDepartemen: true } },
      },
    }),
    prisma.tBerita.count({ where }),
  ]);

  const items = rawItems.map((p) => ({
    id: String(p.idBerita),
    title: p.judul,
    slug: p.slug,
    category: p.kategori,
    excerpt: p.ringkasan,
    content: p.konten,
    coverMediaId: p.fotoCover,
    status: p.status,
    publishedAt: p.tanggalPublish,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    department: p.departemen ? { nama: p.departemen.namaDepartemen } : null,
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminPostById(id: string) {
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return null;

  const p = await prisma.tBerita.findUnique({
    where: { idBerita: numId },
    include: {
      departemen: { select: { namaDepartemen: true } },
    },
  });

  if (!p) return null;

  return {
    id: String(p.idBerita),
    title: p.judul,
    slug: p.slug,
    category: p.kategori,
    excerpt: p.ringkasan,
    content: p.konten,
    coverMediaId: p.fotoCover,
    documentation: p.fotoDokumentasi,
    status: p.status,
    publishedAt: p.tanggalPublish,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    department: p.departemen ? { nama: p.departemen.namaDepartemen } : null,
  };
}
