import prisma from "@/lib/db";

export async function getPublicDepartments() {
  const depts = await prisma.department.findMany({
    include: {
      profile: true,
      programs: {
        where: { status: "published" },
      },
      users: {
        where: { generasi: 11 },
        select: { id: true },
      },
    },
  });

  return depts
    .filter((d) => !d.profile || d.profile.isActive === 1)
    .sort((a, b) => (a.profile?.sortOrder ?? 0) - (b.profile?.sortOrder ?? 0))
    .map((d) => ({
      id: d.id,
      name: d.nama,
      slug: d.profile?.slug || d.id,
      shortDescription: d.profile?.shortDescription || "",
      description: d.profile?.description || "",
      vision: d.profile?.vision || "",
      mission: d.profile?.mission || "",
      isActive: Boolean(d.profile?.isActive ?? 1),
      orderIndex: d.profile?.sortOrder ?? 0,
      _count: {
        members: d.users.length,
        workPrograms: d.programs.length,
      },
    }));
}

export async function getPublicDepartmentBySlug(slug: string) {
  const profile = await prisma.departmentProfile.findUnique({
    where: { slug },
    include: {
      department: {
        include: {
          users: {
            where: { generasi: 11 },
            select: {
              id: true,
              namaLengkap: true,
              jabatan: true,
              linkedinUrl: true,
              instagramUsername: true,
              avatarUrl: true,
            },
          },
          programs: {
            where: { status: "published" },
          },
        },
      },
    },
  });

  if (!profile || profile.isActive === 0) return null;

  return {
    id: profile.departmentId,
    name: profile.department.nama,
    slug: profile.slug,
    shortDescription: profile.shortDescription,
    description: profile.description,
    vision: profile.vision,
    mission: profile.mission,
    members: profile.department.users.map((u) => ({
      id: u.id,
      name: u.namaLengkap,
      position: u.jabatan,
      linkedinUrl: u.linkedinUrl,
      instagramUsername: u.instagramUsername,
      photoUrl: u.avatarUrl,
    })),
    workPrograms: profile.department.programs.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      content: p.content,
    })),
  };
}
