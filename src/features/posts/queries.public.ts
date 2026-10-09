import prisma from "@/lib/db";

export async function getPublishedPosts({ page = 1, pageSize = 9 } = {}) {
  const skip = (page - 1) * pageSize;
  const now = Math.floor(Date.now() / 1000);

  const [rawItems, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: "published",
        publishedAt: { lte: now },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: pageSize,
      include: {
        department: true,
      },
    }),
    prisma.post.count({
      where: {
        status: "published",
        publishedAt: { lte: now },
      },
    }),
  ]);

  const items = rawItems.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    excerpt: p.excerpt,
    content: p.content,
    coverImageUrl: p.coverMediaId || null,
    status: p.status,
    publishedAt: p.publishedAt ? new Date(p.publishedAt * 1000).toISOString() : null,
    isFeatured: Boolean(p.isFeatured),
    department: p.department ? { id: p.department.id, name: p.department.nama } : null,
    author: { name: "Pengurus PERISAI UMI" },
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPublishedPostBySlug(slug: string) {
  const p = await prisma.post.findFirst({
    where: {
      slug,
      status: "published",
    },
    include: {
      department: true,
      images: {
        include: { media: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    excerpt: p.excerpt,
    content: p.content,
    coverImageUrl: p.coverMediaId || null,
    status: p.status,
    publishedAt: p.publishedAt ? new Date(p.publishedAt * 1000).toISOString() : null,
    isFeatured: Boolean(p.isFeatured),
    department: p.department ? { id: p.department.id, name: p.department.nama } : null,
    author: { name: "Pengurus PERISAI UMI" },
    images: p.images.map((img: (typeof p.images)[number]) => ({
      mediaId: img.mediaId,
      url: `/uploads/${img.media.storageKey}`,
      caption: img.caption,
    })),
  };
}
