import prisma from "@/lib/db";

export async function getPublicWorkPrograms({ departmentSlug }: { departmentSlug?: string } = {}) {
  const whereClause: {
    status: string;
    department?: {
      profile: { is: { slug: string } };
    };
  } = {
    status: "published",
  };

  if (departmentSlug) {
    whereClause.department = {
      profile: { is: { slug: departmentSlug } },
    };
  }

  const programs = await prisma.workProgram.findMany({
    where: whereClause,
    include: {
      department: {
        include: { profile: true },
      },
      images: {
        include: { media: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return programs.map((p) => ({
    id: p.id,
    name: p.title,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    description: p.content || "",
    status: p.status,
    coverImageUrl: p.coverMediaId || null,
    department: {
      id: p.department.id,
      name: p.department.nama,
      slug: p.department.profile?.slug || p.department.id,
      code: p.department.profile?.slug?.toUpperCase() || "",
    },
    period: {
      name: "Periode Berjalan",
    },
  }));
}

export async function getPublicWorkProgramBySlug(slug: string) {
  const p = await prisma.workProgram.findFirst({
    where: { slug, status: "published" },
    include: {
      department: {
        include: { profile: true },
      },
      images: {
        include: { media: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    name: p.title,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    description: p.content || "",
    status: p.status,
    coverImageUrl: p.coverMediaId || null,
    department: {
      id: p.department.id,
      name: p.department.nama,
      slug: p.department.profile?.slug || p.department.id,
      code: p.department.profile?.slug?.toUpperCase() || "",
    },
    period: {
      name: "Periode Berjalan",
    },
    images: p.images.map((img) => ({
      mediaId: img.mediaId,
      url: `/uploads/${img.media.storageKey}`,
      caption: img.caption,
    })),
  };
}
