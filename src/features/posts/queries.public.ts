import { cache } from "react";
import prisma from "@/lib/db";
import { parseDate } from "@/lib/dates";

export interface GetPublishedPostsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  isFeatured?: boolean;
}

export interface PublishedPostsResult {
  items: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    content: string | null;
    coverImageUrl: string;
    status: string;
    publishedAt: string | null;
    isFeatured: boolean;
    department: { id: string; name: string } | null;
    author: { name: string };
    readTime: number;
  }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  categories: Array<{ name: string; count: number }>;
}

const postsCache = new Map<string, { data: PublishedPostsResult; expiry: number }>();
const POSTS_TTL_MS = 3 * 60 * 1000; // 3 menit cache

export const getPublishedPosts = cache(async function getPublishedPosts({
  page = 1,
  pageSize = 9,
  category,
  search,
  isFeatured,
}: GetPublishedPostsParams = {}): Promise<PublishedPostsResult> {
  const cacheKey = `${page}:${pageSize}:${category || ""}:${search || ""}:${isFeatured}`;
  const now = Math.floor(Date.now() / 1000);
  const cached = postsCache.get(cacheKey);

  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const skip = (page - 1) * pageSize;

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
        select: {
          idBerita: true,
          judul: true,
          slug: true,
          kategori: true,
          ringkasan: true,
          fotoCover: true,
          status: true,
          tanggalPublish: true,
          isFeatured: true,
          departemen: {
            select: {
              idDepartemen: true,
              namaDepartemen: true,
            },
          },
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
      content: p.ringkasan, // Menggunakan ringkasan untuk listing untuk menghemat transfer data
      coverImageUrl: p.fotoCover || "/og-default.webp",
      status: p.status,
      publishedAt: parseDate(p.tanggalPublish)?.toISOString() || null,
      isFeatured: Boolean(p.isFeatured),
      department: p.departemen ? { id: String(p.departemen.idDepartemen), name: p.departemen.namaDepartemen } : null,
      author: { name: p.departemen?.namaDepartemen || "Pengurus PERISAI UMI" },
      readTime: Math.max(2, Math.ceil((p.ringkasan ? p.ringkasan.split(/\s+/).length : 60) / 40)),
    }));

    const result: PublishedPostsResult = {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
    };

    postsCache.set(cacheKey, { data: result, expiry: Date.now() + POSTS_TTL_MS });
    return result;
  } catch (err) {
    console.warn("Notice: failed to load T_Berita:", err);
    if (cached) return cached.data;
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      categories: [{ name: "Semua", count: 0 }],
    };
  }
});

export const getPublishedPostBySlug = cache(async function getPublishedPostBySlug(slug: string) {
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

    // Dapatkan berita terkait dengan select hemat kolom
    const rawRelated = await prisma.tBerita.findMany({
      where: {
        status: "published",
        slug: { not: slug },
        ...(p.kategori ? { kategori: p.kategori } : {}),
      },
      take: 3,
      orderBy: { tanggalPublish: "desc" },
      select: {
        idBerita: true,
        judul: true,
        slug: true,
        kategori: true,
        ringkasan: true,
        fotoCover: true,
        tanggalPublish: true,
        departemen: {
          select: {
            idDepartemen: true,
            namaDepartemen: true,
          },
        },
      },
    });

    const relatedPosts = rawRelated.map((rp) => ({
      id: String(rp.idBerita),
      title: rp.judul,
      slug: rp.slug,
      category: rp.kategori || "Berita",
      excerpt: rp.ringkasan,
      coverImageUrl: rp.fotoCover || "/og-default.jpg",
      publishedAt: parseDate(rp.tanggalPublish)?.toISOString() || null,
      department: rp.departemen ? { id: String(rp.departemen.idDepartemen), name: rp.departemen.namaDepartemen } : null,
      author: { name: rp.departemen?.namaDepartemen || "Pengurus PERISAI UMI" },
      readTime: Math.max(2, Math.ceil((rp.ringkasan ? rp.ringkasan.split(/\s+/).length : 60) / 40)),
    }));

    return {
      id: String(p.idBerita),
      title: p.judul,
      slug: p.slug,
      category: p.kategori || "Berita",
      excerpt: p.ringkasan,
      content: p.konten,
      coverImageUrl: p.fotoCover || "/og-default.webp",
      status: p.status,
      publishedAt: parseDate(p.tanggalPublish)?.toISOString() || null,
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
});
