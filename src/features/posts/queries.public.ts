import prisma from "@/lib/db";

export interface GetPublishedPostsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  isFeatured?: boolean;
}

export async function getPublishedPosts({
  page = 1,
  pageSize = 9,
  category,
  search,
  isFeatured,
}: GetPublishedPostsParams = {}) {
  const skip = (page - 1) * pageSize;
  const now = Math.floor(Date.now() / 1000);

  const where: Record<string, unknown> = {
    status: "published",
    publishedAt: { lte: now },
  };

  if (category && category !== "Semua") {
    where.category = category;
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured ? 1 : 0;
  }

  if (search && search.trim() !== "") {
    const q = search.trim();
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } },
    ];
  }

  const [rawItems, total, allCategories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
      ],
      skip,
      take: pageSize,
      include: {
        department: true,
      },
    }),
    prisma.post.count({ where }),
    prisma.post.findMany({
      where: {
        status: "published",
        publishedAt: { lte: now },
      },
      select: { category: true },
    }),
  ]);

  // Hitung jumlah tiap kategori
  const categoryCounts: Record<string, number> = { Semua: allCategories.length };
  for (const item of allCategories) {
    if (item.category) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  }

  const items = rawItems.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category || "Berita",
    excerpt: p.excerpt,
    content: p.content,
    coverImageUrl: p.coverMediaId || "/og-default.jpg",
    status: p.status,
    publishedAt: p.publishedAt ? new Date(p.publishedAt * 1000).toISOString() : null,
    isFeatured: Boolean(p.isFeatured),
    department: p.department ? { id: p.department.id, name: p.department.nama } : null,
    author: { name: p.department?.nama || "Pengurus PERISAI UMI" },
    readTime: Math.max(2, Math.ceil((p.content ? p.content.split(/\s+/).length : 200) / 180)),
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
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

  // Dapatkan berita terkait
  const rawRelated = await prisma.post.findMany({
    where: {
      status: "published",
      slug: { not: slug },
      ...(p.category ? { category: p.category } : {}),
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { department: true },
  });

  const relatedPosts = rawRelated.map((rp) => ({
    id: rp.id,
    title: rp.title,
    slug: rp.slug,
    category: rp.category || "Berita",
    excerpt: rp.excerpt,
    coverImageUrl: rp.coverMediaId || "/og-default.jpg",
    publishedAt: rp.publishedAt ? new Date(rp.publishedAt * 1000).toISOString() : null,
    department: rp.department ? { id: rp.department.id, name: rp.department.nama } : null,
    author: { name: rp.department?.nama || "Pengurus PERISAI UMI" },
    readTime: Math.max(2, Math.ceil((rp.content ? rp.content.split(/\s+/).length : 200) / 180)),
  }));

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category || "Berita",
    excerpt: p.excerpt,
    content: p.content,
    coverImageUrl: p.coverMediaId || "/og-default.jpg",
    status: p.status,
    publishedAt: p.publishedAt ? new Date(p.publishedAt * 1000).toISOString() : null,
    isFeatured: Boolean(p.isFeatured),
    department: p.department ? { id: p.department.id, name: p.department.nama } : null,
    author: { name: p.department?.nama || "Pengurus PERISAI UMI" },
    readTime: Math.max(2, Math.ceil((p.content ? p.content.split(/\s+/).length : 200) / 180)),
    images: p.images.map((img: (typeof p.images)[number]) => ({
      mediaId: img.mediaId,
      url: `/uploads/${img.media.storageKey}`,
      caption: img.caption,
    })),
    relatedPosts,
  };
}
