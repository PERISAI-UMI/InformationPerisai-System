import prisma from "@/lib/db";

export async function getPublicOpportunities({
  category,
  onlyOpen = false,
}: {
  category?: string;
  onlyOpen?: boolean;
} = {}) {
  const now = Math.floor(Date.now() / 1000);
  const where: {
    status: string;
    category?: string;
    OR?: Array<{ deadlineAt: null } | { deadlineAt: { gte: number } }>;
  } = {
    status: "published",
  };

  if (category) {
    where.category = category;
  }

  if (onlyOpen) {
    where.OR = [
      { deadlineAt: null },
      { deadlineAt: { gte: now } },
    ];
  }

  const items = await prisma.opportunity.findMany({
    where,
    orderBy: { deadlineAt: "asc" },
  });

  return items.map((op) => ({
    id: op.id,
    type: op.type,
    title: op.title,
    slug: op.slug,
    category: op.category || "LOMBA",
    organizer: op.organizer || "PERISAI UMI",
    description: op.description || "",
    deadlineAt: op.deadlineAt ? new Date(op.deadlineAt * 1000).toISOString() : null,
    registrationUrl: op.registrationUrl || null,
    coverImageUrl: op.posterMediaId || null,
    status: op.status,
    isOpen: op.deadlineAt === null || op.deadlineAt >= now,
  }));
}

export async function getPublicOpportunityBySlug(slug: string) {
  const now = Math.floor(Date.now() / 1000);
  const op = await prisma.opportunity.findFirst({
    where: { slug, status: "published" },
  });

  if (!op) return null;

  return {
    id: op.id,
    type: op.type,
    title: op.title,
    slug: op.slug,
    category: op.category || "LOMBA",
    organizer: op.organizer || "PERISAI UMI",
    description: op.description || "",
    deadlineAt: op.deadlineAt ? new Date(op.deadlineAt * 1000).toISOString() : null,
    registrationUrl: op.registrationUrl || null,
    coverImageUrl: op.posterMediaId || null,
    status: op.status,
    isOpen: op.deadlineAt === null || op.deadlineAt >= now,
  };
}
