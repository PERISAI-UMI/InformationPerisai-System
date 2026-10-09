import prisma from "@/lib/db";

export async function getDashboardOverview() {
  const now = Math.floor(Date.now() / 1000);
  const [
    totalPosts,
    totalWorkPrograms,
    totalOpportunities,
    totalMembers,
    unreadMessages,
    closingSoonOpportunities,
    recentPostsRaw,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.workProgram.count(),
    prisma.opportunity.count(),
    prisma.user.count({ where: { generasi: 11 } }),
    prisma.inboxMessage.count({ where: { isRead: 0 } }),
    prisma.opportunity.findMany({
      where: { deadlineAt: { gte: now } },
      orderBy: { deadlineAt: "asc" },
      take: 5,
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { department: { select: { nama: true } } },
    }),
  ]);

  const recentPosts = recentPostsRaw.map((p) => ({
    ...p,
    author: { name: p.department?.nama || "Pengurus" },
  }));

  return {
    stats: {
      totalPosts,
      totalWorkPrograms,
      totalOpportunities,
      totalMembers,
      unreadMessages,
    },
    closingSoonOpportunities,
    recentPosts,
  };
}
