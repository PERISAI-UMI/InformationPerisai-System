import prisma from "@/lib/db";

export async function getDashboardOverview() {
  const now = Math.floor(Date.now() / 1000);
  try {
    const [
      totalPosts,
      totalWorkPrograms,
      totalOpportunities,
      totalMembers,
      unreadMessages,
      closingSoonOpportunitiesRaw,
      recentPostsRaw,
    ] = await Promise.all([
      prisma.tBerita.count(),
      prisma.tProker.count(),
      prisma.tKompetisi.count(),
      prisma.mAnggota.count(),
      prisma.tPesanMasuk.count({ where: { isRead: 0 } }),
      prisma.tKompetisi.findMany({
        where: { deadlinePendaftaran: { gte: now } },
        orderBy: { deadlinePendaftaran: "asc" },
        take: 5,
      }),
      prisma.tBerita.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { departemen: { select: { namaDepartemen: true } } },
      }),
    ]);

    const closingSoonOpportunities = closingSoonOpportunitiesRaw.map((o) => ({
      id: String(o.idKompetisi),
      title: o.namaKompetisi,
      slug: o.slug,
      organizer: o.penyelenggara,
      category: o.kategori,
      deadlineAt: o.deadlinePendaftaran,
      type: o.tipe,
    }));

    const recentPosts = recentPostsRaw.map((p) => ({
      id: String(p.idBerita),
      title: p.judul,
      slug: p.slug,
      status: p.status,
      createdAt: p.createdAt,
      author: { name: p.departemen?.namaDepartemen || "Pengurus" },
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
  } catch (err) {
    console.error("Gagal memuat ringkasan dashboard:", err);
    return {
      stats: {
        totalPosts: 0,
        totalWorkPrograms: 0,
        totalOpportunities: 0,
        totalMembers: 42,
        unreadMessages: 0,
      },
      closingSoonOpportunities: [],
      recentPosts: [],
    };
  }
}
