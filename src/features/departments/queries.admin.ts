import prisma from "@/lib/db";

export async function getAdminDepartments() {
  const depts = await prisma.mDepartemen.findMany({
    orderBy: { urutan: "asc" },
    include: {
      _count: {
        select: { proker: true, kepengurusan: true },
      },
    },
  });

  return depts.map((d) => ({
    id: String(d.idDepartemen),
    name: d.namaDepartemen,
    slug: d.slug,
    code: d.singkatan,
    description: d.deskripsiSingkat || d.tupoksiUtama || "",
    orderIndex: d.urutan,
    isActive: Boolean(d.isActive),
    _count: {
      workPrograms: d._count.proker,
      members: d._count.kepengurusan,
    },
  }));
}

export async function getAdminDepartmentById(id: string) {
  const numId = parseInt(id, 10);
  const d = isNaN(numId)
    ? await prisma.mDepartemen.findUnique({ where: { slug: id } })
    : await prisma.mDepartemen.findUnique({ where: { idDepartemen: numId } });

  if (!d) return null;

  return {
    id: String(d.idDepartemen),
    name: d.namaDepartemen,
    slug: d.slug,
    code: d.singkatan,
    description: d.deskripsiSingkat || d.tupoksiUtama || "",
    orderIndex: d.urutan,
    isActive: Boolean(d.isActive),
    profile: {
      slug: d.slug,
      shortDescription: d.deskripsiSingkat,
      description: d.tupoksiUtama,
      vision: d.visi,
      mission: d.misi,
    },
  };
}
