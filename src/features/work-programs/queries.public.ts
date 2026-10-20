import { cache } from "react";
import prisma from "@/lib/db";

export interface PublicWorkProgramItem {
  id: string;
  name: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string;
  status: string;
  coverImageUrl: string | null;
  documentationUrl: string | null;
  department: {
    id: string;
    name: string;
    slug: string;
    code: string | null;
  };
  period: {
    name: string;
  };
}

let cachedWorkPrograms: { data: PublicWorkProgramItem[]; expiry: number; key: string } | null = null;
const PROKER_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const getPublicWorkPrograms = cache(async function getPublicWorkPrograms({
  departmentSlug,
}: { departmentSlug?: string } = {}): Promise<PublicWorkProgramItem[]> {
  const cacheKey = departmentSlug || "__all__";
  const now = Date.now();
  if (cachedWorkPrograms && cachedWorkPrograms.key === cacheKey && cachedWorkPrograms.expiry > now) {
    return cachedWorkPrograms.data;
  }

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

    const result = programs.map((p) => ({
      id: String(p.idProker),
      name: p.namaProker,
      title: p.namaProker,
      slug: p.slug,
      summary: p.deskripsi,
      description: p.deskripsi || "",
      status: p.status,
      coverImageUrl: p.fotoCover || null,
      documentationUrl: p.fotoDokumentasi || null,
      department: p.departemen
        ? {
            id: String(p.departemen.idDepartemen),
            name: p.departemen.namaDepartemen,
            slug: p.departemen.slug,
            code: p.departemen.singkatan,
          }
        : {
            id: "0",
            name: "Umum",
            slug: "umum",
            code: null,
          },
      period: {
        name: "Periode Berjalan",
      },
    }));

    cachedWorkPrograms = { data: result, expiry: now + PROKER_TTL_MS, key: cacheKey };
    return result;
  } catch (err) {
    console.warn("Notice: failed to load T_Proker:", err);
    if (cachedWorkPrograms && cachedWorkPrograms.key === cacheKey) {
      return cachedWorkPrograms.data;
    }
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
      department: p.departemen
        ? {
            id: String(p.departemen.idDepartemen),
            name: p.departemen.namaDepartemen,
            slug: p.departemen.slug,
            code: p.departemen.singkatan,
          }
        : {
            id: "0",
            name: "Umum",
            slug: "umum",
            code: null,
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
