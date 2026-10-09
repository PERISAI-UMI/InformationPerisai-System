import prisma from "@/lib/db";

export async function getAdminDepartments() {
  const depts = await prisma.department.findMany({
    orderBy: { nama: "asc" },
    include: {
      profile: true,
      _count: {
        select: { programs: true, users: true },
      },
    },
  });

  return depts.map((d) => ({
    id: d.id,
    name: d.nama,
    slug: d.profile?.slug || d.id,
    code: d.profile?.slug?.toUpperCase() || "",
    description: d.profile?.description || "",
    orderIndex: d.profile?.sortOrder ?? 0,
    isActive: Boolean(d.profile?.isActive ?? 1),
    _count: {
      workPrograms: d._count.programs,
      members: d._count.users,
    },
  }));
}

export async function getAdminDepartmentById(id: string) {
  return prisma.department.findUnique({
    where: { id },
  });
}
