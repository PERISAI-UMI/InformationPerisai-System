import prisma from "@/lib/db";

export async function getAdminInbox({ page = 1, pageSize = 8 } = {}) {
  const skip = (page - 1) * pageSize;

  const [itemsRaw, total, unreadCount] = await Promise.all([
    prisma.tPesanMasuk.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.tPesanMasuk.count(),
    prisma.tPesanMasuk.count({ where: { isRead: 0 } }),
  ]);

  const items = itemsRaw.map((p) => ({
    id: String(p.idPesan),
    name: p.namaPengirim,
    email: p.email,
    phone: p.noWa,
    purpose: p.tujuan,
    subject: p.subjek,
    message: p.isiPesan,
    isRead: p.isRead,
    createdAt: p.createdAt,
  }));

  return {
    items,
    total,
    unreadCount,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminInboxMessageById(id: string) {
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return null;

  const p = await prisma.tPesanMasuk.findUnique({
    where: { idPesan: numId },
  });

  if (!p) return null;

  return {
    id: String(p.idPesan),
    name: p.namaPengirim,
    email: p.email,
    phone: p.noWa,
    purpose: p.tujuan,
    subject: p.subjek,
    message: p.isiPesan,
    isRead: p.isRead,
    createdAt: p.createdAt,
  };
}
