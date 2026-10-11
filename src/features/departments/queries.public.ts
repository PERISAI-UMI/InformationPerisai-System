import prisma from "@/lib/db";

export async function getPublicDepartments() {
  try {
    const depts = await prisma.mDepartemen.findMany({
      where: { isActive: 1 },
      orderBy: { urutan: "asc" },
      include: {
        proker: {
          where: { status: "published" },
        },
        kepengurusan: {
          where: { status: "aktif" },
          select: { idKepengurusan: true },
        },
      },
    });

    return depts.map((d) => ({
      id: String(d.idDepartemen),
      name: d.namaDepartemen,
      slug: d.slug,
      shortDescription: d.deskripsiSingkat || "",
      description: d.tupoksiUtama || "",
      vision: d.visi || "",
      mission: d.misi || "",
      isActive: Boolean(d.isActive),
      orderIndex: d.urutan,
      _count: {
        members: d.kepengurusan.length,
        workPrograms: d.proker.length,
      },
    }));
  } catch (err) {
    console.warn("Notice: failed to load departments:", err);
    return [];
  }
}

export async function getPublicDepartmentBySlug(slug: string) {
  try {
    const dept = await prisma.mDepartemen.findFirst({
      where: { slug, isActive: 1 },
      include: {
        kepengurusan: {
          where: { status: "aktif" },
          include: {
            anggota: true,
            jabatan: true,
          },
          orderBy: { urutan: "asc" },
        },
        proker: {
          where: { status: "published" },
          orderBy: { urutan: "asc" },
        },
      },
    });

    if (!dept) return null;

    return {
      id: String(dept.idDepartemen),
      name: dept.namaDepartemen,
      slug: dept.slug,
      shortDescription: dept.deskripsiSingkat,
      description: dept.tupoksiUtama,
      vision: dept.visi,
      mission: dept.misi,
      members: dept.kepengurusan.map((k) => ({
        id: k.anggota.idPerisai,
        name: k.anggota.namaLengkap,
        position: k.jabatan.namaJabatan,
        linkedinUrl: k.anggota.linkedin,
        instagramUsername: k.anggota.instagram,
        photoUrl: k.anggota.fotoUrl,
      })),
      workPrograms: dept.proker.map((p) => ({
        id: String(p.idProker),
        title: p.namaProker,
        slug: p.slug,
        summary: p.deskripsi,
        content: p.deskripsi,
      })),
    };
  } catch (err) {
    console.error("Gagal mengambil departemen:", err);
    return null;
  }
}
