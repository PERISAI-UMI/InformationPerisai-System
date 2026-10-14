import { cache } from "react";
import prisma from "@/lib/db";

export const getPublicWorkPrograms = cache(async function getPublicWorkPrograms({
  departmentSlug,
}: { departmentSlug?: string } = {}) {
  const whereClause: {
    status: string;
    departemen?: { slug: string };
  } = {
    status: "published",
  };

  if (departmentSlug) {
    whereClause.departemen = { slug: departmentSlug };
  }

  try {
    const programs = await prisma.tProker.findMany({
      where: whereClause,
      select: {
        idProker: true,
        namaProker: true,
        slug: true,
        deskripsi: true,
        status: true,
        fotoCover: true,
        fotoDokumentasi: true,
        departemen: {
          select: {
            idDepartemen: true,
            namaDepartemen: true,
            slug: true,
            singkatan: true,
          },
        },
      },
      orderBy: { urutan: "asc" },
    });

    return programs.map((p) => ({
      id: String(p.idProker),
      name: p.namaProker,
      title: p.namaProker,
      slug: p.slug,
      summary: p.deskripsi,
      description: p.deskripsi || "",
      status: p.status,
      coverImageUrl: p.fotoCover || null,
      documentationUrl: p.fotoDokumentasi || null,
      department: {
        id: String(p.departemen.idDepartemen),
        name: p.departemen.namaDepartemen,
        slug: p.departemen.slug,
        code: p.departemen.singkatan,
      },
      period: {
        name: "Periode Berjalan",
      },
    }));
  } catch (err) {
    console.warn("Notice: failed to load T_Proker:", err);
    return [];
  }
});

export const getPublicWorkProgramBySlug = cache(async function getPublicWorkProgramBySlug(slug: string) {
  try {
    const p = await prisma.tProker.findFirst({
      where: { slug, status: "published" },
      select: {
        idProker: true,
        namaProker: true,
        slug: true,
        deskripsi: true,
        status: true,
        fotoCover: true,
        fotoDokumentasi: true,
        departemen: {
          select: {
            idDepartemen: true,
            namaDepartemen: true,
            slug: true,
            singkatan: true,
          },
        },
      },
    });

    if (!p) return null;

    return {
      id: String(p.idProker),
      name: p.namaProker,
      title: p.namaProker,
      slug: p.slug,
      summary: p.deskripsi,
      description: p.deskripsi || "",
      status: p.status,
      coverImageUrl: p.fotoCover || null,
      department: {
        id: String(p.departemen.idDepartemen),
        name: p.departemen.namaDepartemen,
        slug: p.departemen.slug,
        code: p.departemen.singkatan,
      },
      period: {
        name: "Periode Berjalan",
      },
      images: p.fotoDokumentasi
        ? [{ mediaId: "dok-proker-1", url: p.fotoDokumentasi, caption: p.namaProker }]
        : [],
    };
  } catch (err) {
    console.error("Gagal mengambil program kerja:", err);
    return null;
  }
});
