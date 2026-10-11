import prisma from "@/lib/db";

export async function getAdminGallery({ page = 1, pageSize = 24 } = {}) {
  const skip = (page - 1) * pageSize;

  const [itemsRaw, total] = await Promise.all([
    prisma.tMedia.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.tMedia.count(),
  ]);

  const items = itemsRaw.map((m) => ({
    id: m.idMedia,
    storageKey: m.kunciPenyimpanan,
    originalName: m.namaBerkas,
    mimeType: m.tipeMime,
    sizeBytes: m.ukuranByte,
    altText: m.altText,
    createdAt: m.createdAt,
    url: m.url || `/uploads/${m.kunciPenyimpanan}`,
    filename: m.kunciPenyimpanan,
    size: m.ukuranByte,
    uploader: { name: "Pengurus" },
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminMediaById(id: string) {
  const m = await prisma.tMedia.findUnique({
    where: { idMedia: id },
  });

  if (!m) return null;

  return {
    id: m.idMedia,
    storageKey: m.kunciPenyimpanan,
    originalName: m.namaBerkas,
    mimeType: m.tipeMime,
    sizeBytes: m.ukuranByte,
    altText: m.altText,
    createdAt: m.createdAt,
    url: m.url || `/uploads/${m.kunciPenyimpanan}`,
    filename: m.kunciPenyimpanan,
    size: m.ukuranByte,
    uploader: { name: "Pengurus" },
  };
}
