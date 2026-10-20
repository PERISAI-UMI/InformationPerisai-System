import { cache } from "react";
import prisma from "@/lib/db";

export interface PublicGalleryResult {
  items: Array<{
    id: string;
    url: string;
    caption: string;
    altText: string;
  }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const galleryCache = new Map<string, { data: PublicGalleryResult; expiry: number }>();
const GALLERY_TTL_MS = 5 * 60 * 1000; // 5 menit

export const getPublicGallery = cache(async function getPublicGallery({ page = 1, pageSize = 12 } = {}): Promise<PublicGalleryResult> {
  const cacheKey = `${page}:${pageSize}`;
  const now = Date.now();
  const cached = galleryCache.get(cacheKey);

  if (cached && cached.expiry > now) {
    return cached.data;
  }

  const skip = (page - 1) * pageSize;

  try {
    const [itemsRaw, total] = await Promise.all([
      prisma.tMedia.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          idMedia: true,
          url: true,
          kunciPenyimpanan: true,
          namaBerkas: true,
          altText: true,
        },
      }),
      prisma.tMedia.count(),
    ]);

    const items = itemsRaw.map((it) => ({
      id: it.idMedia,
      url: it.url || `/uploads/${it.kunciPenyimpanan}`,
      caption: it.namaBerkas,
      altText: it.altText || it.namaBerkas,
    }));

    const result: PublicGalleryResult = {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    galleryCache.set(cacheKey, { data: result, expiry: now + GALLERY_TTL_MS });
    return result;
  } catch (err) {
    console.warn("Notice: failed to load T_Media gallery:", err);
    if (cached) return cached.data;
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
    };
  }
});
