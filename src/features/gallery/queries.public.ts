import prisma from "@/lib/db";

export async function getPublicGallery({ page = 1, pageSize = 12 } = {}) {
  const skip = (page - 1) * pageSize;

  const [itemsRaw, total] = await Promise.all([
    prisma.galleryItem.findMany({
      where: { isActive: 1 },
      include: { media: true },
      orderBy: { sortOrder: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.galleryItem.count({
      where: { isActive: 1 },
    }),
  ]);

  const items = itemsRaw
    .filter((it: (typeof itemsRaw)[number]) => Boolean(it.media))
    .map((it: (typeof itemsRaw)[number]) => ({
      id: it.id,
      url: it.media ? `/uploads/${it.media.storageKey}` : "/logoperisaii.png",
      caption: it.title,
      altText: it.media?.altText || it.title,
    }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
