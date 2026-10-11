import prisma from "@/lib/db";

export interface GetPublicOpportunitiesParams {
  type?: string;
  category?: string;
  search?: string;
  onlyOpen?: boolean;
}

export async function getPublicOpportunities({
  type,
  category,
  search,
  onlyOpen = false,
}: GetPublicOpportunitiesParams = {}) {
  const now = Math.floor(Date.now() / 1000);
  const where: Record<string, unknown> = {
    status: "published",
  };

  if (type && type !== "Semua") {
    where.tipe = type.toLowerCase();
  }

  if (category && category !== "Semua") {
    where.kategori = category;
  }

  if (search && search.trim() !== "") {
    const q = search.trim();
    where.OR = [
      { namaKompetisi: { contains: q } },
      { deskripsi: { contains: q } },
      { penyelenggara: { contains: q } },
    ];
  }

  if (onlyOpen) {
    where.OR = [
      { deadlinePendaftaran: null },
      { deadlinePendaftaran: { gte: now } },
    ];
  }

  try {
    const [items, allOpportunities] = await Promise.all([
      prisma.tKompetisi.findMany({
        where,
        orderBy: [
          { deadlinePendaftaran: "asc" },
        ],
      }),
      prisma.tKompetisi.findMany({
        where: { status: "published" },
        select: { tipe: true, kategori: true, deadlinePendaftaran: true },
      }),
    ]);

    // Hitung jumlah tiap jenis tipe
    const typeCounts: Record<string, number> = {
      Semua: allOpportunities.length,
      lomba: 0,
      beasiswa: 0,
      hibah: 0,
      seminar: 0,
    };

    for (const op of allOpportunities) {
      const t = (op.tipe || "lomba").toLowerCase();
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    }

    return {
      items: items.map((op) => {
        const deadlineSec = op.deadlinePendaftaran;
        const isOpen = deadlineSec === null || deadlineSec >= now;
        const secondsLeft = deadlineSec ? deadlineSec - now : null;
        const daysLeft = secondsLeft !== null ? Math.ceil(secondsLeft / 86400) : null;
        const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

        return {
          id: String(op.idKompetisi),
          type: op.tipe || "lomba",
          title: op.namaKompetisi,
          slug: op.slug,
          category: op.kategori || "KOMPETISI",
          organizer: op.penyelenggara || "PERISAI UMI",
          description: op.deskripsi || "",
          deadlineAt: deadlineSec ? new Date(deadlineSec * 1000).toISOString() : null,
          registrationUrl: op.linkPendaftaran || null,
          coverImageUrl: op.linkPoster || "/og-default.jpg",
          status: op.status,
          isOpen,
          daysLeft,
          isUrgent,
        };
      }),
      typeCounts,
      total: items.length,
    };
  } catch (err) {
    console.warn("Notice: failed to load T_Kompetisi:", err);
    return {
      items: [],
      typeCounts: { Semua: 0, lomba: 0, beasiswa: 0, hibah: 0, seminar: 0 },
      total: 0,
    };
  }
}

export async function getPublicOpportunityBySlug(slug: string) {
  const now = Math.floor(Date.now() / 1000);
  try {
    const op = await prisma.tKompetisi.findFirst({
      where: { slug, status: "published" },
    });

    if (!op) return null;

    const deadlineSec = op.deadlinePendaftaran;
    const isOpen = deadlineSec === null || deadlineSec >= now;
    const secondsLeft = deadlineSec ? deadlineSec - now : null;
    const daysLeft = secondsLeft !== null ? Math.ceil(secondsLeft / 86400) : null;
    const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

    // Dapatkan peluang serupa
    const rawRelated = await prisma.tKompetisi.findMany({
      where: {
        status: "published",
        slug: { not: slug },
        ...(op.tipe ? { tipe: op.tipe } : {}),
      },
      take: 3,
      orderBy: { deadlinePendaftaran: "asc" },
    });

    const relatedOpportunities = rawRelated.map((ro) => {
      const rDeadline = ro.deadlinePendaftaran;
      const rIsOpen = rDeadline === null || rDeadline >= now;
      const rSecLeft = rDeadline ? rDeadline - now : null;
      const rDaysLeft = rSecLeft !== null ? Math.ceil(rSecLeft / 86400) : null;

      return {
        id: String(ro.idKompetisi),
        type: ro.tipe || "lomba",
        title: ro.namaKompetisi,
        slug: ro.slug,
        category: ro.kategori || "KOMPETISI",
        organizer: ro.penyelenggara || "PERISAI UMI",
        deadlineAt: rDeadline ? new Date(rDeadline * 1000).toISOString() : null,
        coverImageUrl: ro.linkPoster || "/og-default.jpg",
        isOpen: rIsOpen,
        daysLeft: rDaysLeft,
      };
    });

    return {
      id: String(op.idKompetisi),
      type: op.tipe || "lomba",
      title: op.namaKompetisi,
      slug: op.slug,
      category: op.kategori || "KOMPETISI",
      organizer: op.penyelenggara || "PERISAI UMI",
      description: op.deskripsi || "",
      deadlineAt: deadlineSec ? new Date(deadlineSec * 1000).toISOString() : null,
      registrationUrl: op.linkPendaftaran || null,
      coverImageUrl: op.linkPoster || "/og-default.jpg",
      status: op.status,
      isOpen,
      daysLeft,
      isUrgent,
      relatedOpportunities,
    };
  } catch (err) {
    console.error("Gagal mengambil peluang:", err);
    return null;
  }
}
