import prisma from "@/lib/db";

export async function getAdminInbox({ page = 1, pageSize = 20 } = {}) {
  const skip = (page - 1) * pageSize;

  const [items, total, unreadCount] = await Promise.all([
    prisma.inboxMessage.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.inboxMessage.count(),
    prisma.inboxMessage.count({ where: { isRead: 0 } }),
  ]);

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
  return prisma.inboxMessage.findUnique({
    where: { id },
  });
}
