import prisma from "@/lib/db";

export async function getAdminGallery({ page = 1, pageSize = 24 } = {}) {
  const skip = (page - 1) * pageSize;

  const [itemsRaw, total] = await Promise.all([
    prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.media.count(),
  ]);

  const items = itemsRaw.map((m) => ({
    ...m,
    url: `/uploads/${m.storageKey}`,
    filename: m.storageKey,
    size: m.sizeBytes,
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
  const m = await prisma.media.findUnique({
    where: { id },
  });

  if (!m) return null;

  return {
    ...m,
    url: `/uploads/${m.storageKey}`,
    filename: m.storageKey,
    size: m.sizeBytes,
    uploader: { name: "Pengurus" },
  };
}
