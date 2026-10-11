import prisma from "@/lib/db";

export async function getAdminOpportunities({ page = 1, pageSize = 8 } = {}) {
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.tKompetisi.findMany({
      skip,
      take: pageSize,
      orderBy: { idKompetisi: "desc" },
    }),
    prisma.tKompetisi.count(),
  ]);

  return {
    items: items.map((op) => ({
      id: String(op.idKompetisi),
      title: op.namaKompetisi,
      slug: op.slug,
      organizer: op.penyelenggara,
      description: op.deskripsi || "",
      category: op.kategori,
      deadlineAt: op.deadlinePendaftaran,
      registrationUrl: op.linkPendaftaran,
      posterMediaId: op.linkPoster,
      coverImageUrl: op.linkPoster,
      status: op.status,
      createdAt: op.createdAt,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminOpportunityById(id: string) {
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) return null;

  const op = await prisma.tKompetisi.findUnique({
    where: { idKompetisi: idNum },
  });

  if (!op) return null;

  return {
    id: String(op.idKompetisi),
    title: op.namaKompetisi,
    slug: op.slug,
    organizer: op.penyelenggara,
    description: op.deskripsi || "",
    category: op.kategori,
    deadlineAt: op.deadlinePendaftaran,
    registrationUrl: op.linkPendaftaran,
    posterMediaId: op.linkPoster,
    coverImageUrl: op.linkPoster,
    status: op.status,
    createdAt: op.createdAt,
  };
}
