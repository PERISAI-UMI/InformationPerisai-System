import prisma from "@/lib/db";

export async function getAdminWorkPrograms({ page = 1, pageSize = 8 } = {}) {
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.tProker.findMany({
      skip,
      take: pageSize,
      orderBy: { idProker: "desc" },
      include: {
        departemen: { select: { idDepartemen: true, namaDepartemen: true, singkatan: true } },
      },
    }),
    prisma.tProker.count(),
  ]);

  return {
    items: items.map((p) => ({
      id: String(p.idProker),
      name: p.namaProker,
      title: p.namaProker,
      slug: p.slug,
      summary: p.deskripsi,
      description: p.deskripsi || "",
      status: p.status,
      coverImageUrl: p.fotoCover || null,
      documentationUrl: p.fotoDokumentasi || null,
      departmentId: String(p.idDepartemen),
      department: p.departemen
        ? {
            id: String(p.idDepartemen),
            nama: p.departemen.namaDepartemen,
            name: p.departemen.namaDepartemen,
            code: p.departemen.singkatan,
          }
        : null,
      createdAt: p.createdAt,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminWorkProgramById(id: string) {
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) return null;

  const p = await prisma.tProker.findUnique({
    where: { idProker: idNum },
    include: {
      departemen: true,
      penanggungJawab: true,
    },
  });

  if (!p) return null;

  return {
    id: String(p.idProker),
    name: p.namaProker,
    title: p.namaProker,
    slug: p.slug,
    departmentId: String(p.idDepartemen),
    periodId: String(p.idPeriode),
    summary: p.deskripsi,
    content: p.deskripsi || "",
    description: p.deskripsi || "",
    status: p.status,
    coverMediaId: p.fotoCover,
    coverImageUrl: p.fotoCover || null,
    documentationUrl: p.fotoDokumentasi || null,
    department: {
      id: String(p.departemen.idDepartemen),
      name: p.departemen.namaDepartemen,
      nama: p.departemen.namaDepartemen,
      slug: p.departemen.slug,
    },
    images: p.fotoDokumentasi
      ? [{ mediaId: "dok-proker-1", url: p.fotoDokumentasi, caption: p.namaProker }]
      : [],
    createdAt: p.createdAt,
  };
}
