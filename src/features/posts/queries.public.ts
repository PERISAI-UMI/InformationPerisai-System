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
    tanggalPublish: { lte: now },
  };

  if (category && category !== "Semua") {
    where.kategori = category;
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured ? 1 : 0;
  }

  if (search && search.trim() !== "") {
    const q = search.trim();
    where.OR = [
      { judul: { contains: q } },
      { ringkasan: { contains: q } },
      { konten: { contains: q } },
    ];
  }

  try {
    const [rawItems, total, allCategories] = await Promise.all([
      prisma.tBerita.findMany({
        where,
        orderBy: [
          { isFeatured: "desc" },
          { tanggalPublish: "desc" },
        ],
        skip,
        take: pageSize,
        include: {
          departemen: true,
        },
      }),
      prisma.tBerita.count({ where }),
      prisma.tBerita.findMany({
        where: {
          status: "published",
          tanggalPublish: { lte: now },
        },
        select: { kategori: true },
      }),
    ]);

    // Hitung jumlah tiap kategori
    const categoryCounts: Record<string, number> = { Semua: allCategories.length };
    for (const item of allCategories) {
      if (item.kategori) {
        categoryCounts[item.kategori] = (categoryCounts[item.kategori] || 0) + 1;
      }
    }

    const items = rawItems.map((p) => ({
      id: String(p.idBerita),
      title: p.judul,
      slug: p.slug,
      category: p.kategori || "Berita",
      excerpt: p.ringkasan,
      content: p.konten,
      coverImageUrl: p.fotoCover || "/og-default.jpg",
      status: p.status,
      publishedAt: p.tanggalPublish ? new Date(p.tanggalPublish * 1000).toISOString() : null,
      isFeatured: Boolean(p.isFeatured),
      department: p.departemen ? { id: String(p.departemen.idDepartemen), name: p.departemen.namaDepartemen } : null,
      author: { name: p.departemen?.namaDepartemen || "Pengurus PERISAI UMI" },
      readTime: Math.max(2, Math.ceil((p.konten ? p.konten.split(/\s+/).length : 200) / 180)),
    }));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
    };
  } catch (err) {
    console.warn("Notice: failed to load T_Berita:", err);
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      categories: [{ name: "Semua", count: 0 }],
    };
  }
}

export async function getPublishedPostBySlug(slug: string) {
  try {
    const p = await prisma.tBerita.findFirst({
      where: {
        slug,
        status: "published",
      },
      include: {
        departemen: true,
      },
    });

    if (!p) return null;

    // Dapatkan berita terkait
    const rawRelated = await prisma.tBerita.findMany({
      where: {
        status: "published",
        slug: { not: slug },
        ...(p.kategori ? { kategori: p.kategori } : {}),
      },
      take: 3,
      orderBy: { tanggalPublish: "desc" },
      include: { departemen: true },
    });

    const relatedPosts = rawRelated.map((rp) => ({
      id: String(rp.idBerita),
      title: rp.judul,
      slug: rp.slug,
      category: rp.kategori || "Berita",
      excerpt: rp.ringkasan,
      coverImageUrl: rp.fotoCover || "/og-default.jpg",
      publishedAt: rp.tanggalPublish ? new Date(rp.tanggalPublish * 1000).toISOString() : null,
      department: rp.departemen ? { id: String(rp.departemen.idDepartemen), name: rp.departemen.namaDepartemen } : null,
      author: { name: rp.departemen?.namaDepartemen || "Pengurus PERISAI UMI" },
      readTime: Math.max(2, Math.ceil((rp.konten ? rp.konten.split(/\s+/).length : 200) / 180)),
    }));

    return {
      id: String(p.idBerita),
      title: p.judul,
      slug: p.slug,
      category: p.kategori || "Berita",
      excerpt: p.ringkasan,
      content: p.konten,
      coverImageUrl: p.fotoCover || "/og-default.jpg",
      status: p.status,
      publishedAt: p.tanggalPublish ? new Date(p.tanggalPublish * 1000).toISOString() : null,
      isFeatured: Boolean(p.isFeatured),
      department: p.departemen ? { id: String(p.departemen.idDepartemen), name: p.departemen.namaDepartemen } : null,
      author: { name: p.departemen?.namaDepartemen || "Pengurus PERISAI UMI" },
      readTime: Math.max(2, Math.ceil((p.konten ? p.konten.split(/\s+/).length : 200) / 180)),
      images: p.fotoDokumentasi
        ? [{ id: "dok-1", url: p.fotoDokumentasi, caption: p.judul, altText: p.judul, sortOrder: 0 }]
        : [],
      relatedPosts,
    };
  } catch (err) {
    console.error("Gagal mengambil berita:", err);
    return null;
  }
}
