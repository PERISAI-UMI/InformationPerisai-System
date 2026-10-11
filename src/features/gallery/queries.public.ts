import prisma from "@/lib/db";

export async function getPublicGallery({ page = 1, pageSize = 12 } = {}) {
  const skip = (page - 1) * pageSize;

  try {
    const [itemsRaw, total] = await Promise.all([
      prisma.tMedia.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.tMedia.count(),
    ]);

    const items = itemsRaw.map((it) => ({
      id: it.idMedia,
      url: it.url || `/uploads/${it.kunciPenyimpanan}`,
      caption: it.namaBerkas,
      altText: it.altText || it.namaBerkas,
    }));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (err) {
    console.warn("Notice: failed to load T_Media gallery:", err);
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
    };
  }
}
