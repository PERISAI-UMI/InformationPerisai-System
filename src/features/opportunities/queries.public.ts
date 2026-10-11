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
    where.type = type.toLowerCase();
  }

  if (category && category !== "Semua") {
    where.category = category;
  }

  if (search && search.trim() !== "") {
    const q = search.trim();
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { organizer: { contains: q } },
    ];
  }

  if (onlyOpen) {
    where.OR = [
      { deadlineAt: null },
      { deadlineAt: { gte: now } },
    ];
  }

  const [items, allOpportunities] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      orderBy: [
        { deadlineAt: "asc" },
      ],
    }),
    prisma.opportunity.findMany({
      where: { status: "published" },
      select: { type: true, category: true, deadlineAt: true },
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
    const t = (op.type || "lomba").toLowerCase();
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  }

  return {
    items: items.map((op) => {
      const deadlineSec = op.deadlineAt;
      const isOpen = deadlineSec === null || deadlineSec >= now;
      const secondsLeft = deadlineSec ? deadlineSec - now : null;
      const daysLeft = secondsLeft !== null ? Math.ceil(secondsLeft / 86400) : null;
      const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

      return {
        id: op.id,
        type: op.type || "lomba",
        title: op.title,
        slug: op.slug,
        category: op.category || "KOMPETISI",
        organizer: op.organizer || "PERISAI UMI",
        description: op.description || "",
        deadlineAt: deadlineSec ? new Date(deadlineSec * 1000).toISOString() : null,
        registrationUrl: op.registrationUrl || null,
        coverImageUrl: op.posterMediaId || "/og-default.jpg",
        status: op.status,
        isOpen,
        daysLeft,
        isUrgent,
      };
    }),
    typeCounts,
    total: items.length,
  };
}

export async function getPublicOpportunityBySlug(slug: string) {
  const now = Math.floor(Date.now() / 1000);
  const op = await prisma.opportunity.findFirst({
    where: { slug, status: "published" },
  });

  if (!op) return null;

  const deadlineSec = op.deadlineAt;
  const isOpen = deadlineSec === null || deadlineSec >= now;
  const secondsLeft = deadlineSec ? deadlineSec - now : null;
  const daysLeft = secondsLeft !== null ? Math.ceil(secondsLeft / 86400) : null;
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  // Dapatkan peluang serupa
  const rawRelated = await prisma.opportunity.findMany({
    where: {
      status: "published",
      slug: { not: slug },
      ...(op.type ? { type: op.type } : {}),
    },
    take: 3,
    orderBy: { deadlineAt: "asc" },
  });

  const relatedOpportunities = rawRelated.map((ro) => {
    const rDeadline = ro.deadlineAt;
    const rIsOpen = rDeadline === null || rDeadline >= now;
    const rSecLeft = rDeadline ? rDeadline - now : null;
    const rDaysLeft = rSecLeft !== null ? Math.ceil(rSecLeft / 86400) : null;

    return {
      id: ro.id,
      type: ro.type || "lomba",
      title: ro.title,
      slug: ro.slug,
      category: ro.category || "KOMPETISI",
      organizer: ro.organizer || "PERISAI UMI",
      deadlineAt: rDeadline ? new Date(rDeadline * 1000).toISOString() : null,
      coverImageUrl: ro.posterMediaId || "/og-default.jpg",
      isOpen: rIsOpen,
      daysLeft: rDaysLeft,
    };
  });

  return {
    id: op.id,
    type: op.type || "lomba",
    title: op.title,
    slug: op.slug,
    category: op.category || "KOMPETISI",
    organizer: op.organizer || "PERISAI UMI",
    description: op.description || "",
    deadlineAt: deadlineSec ? new Date(deadlineSec * 1000).toISOString() : null,
    registrationUrl: op.registrationUrl || null,
    coverImageUrl: op.posterMediaId || "/og-default.jpg",
    status: op.status,
    isOpen,
    daysLeft,
    isUrgent,
    relatedOpportunities,
  };
}
