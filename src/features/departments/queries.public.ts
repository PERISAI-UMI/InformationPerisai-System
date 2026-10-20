import { cache } from "react";
import prisma from "@/lib/db";

export interface PublicDepartmentItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  vision: string;
  mission: string;
  isActive: boolean;
  orderIndex: number;
  _count: {
    members: number;
    workPrograms: number;
  };
}

let cachedDepartments: { data: PublicDepartmentItem[]; expiry: number } | null = null;
const DEPT_TTL_MS = 5 * 60 * 1000; // 5 menit

export const getPublicDepartments = cache(async function getPublicDepartments(): Promise<PublicDepartmentItem[]> {
  const now = Date.now();
  if (cachedDepartments && cachedDepartments.expiry > now) {
    return cachedDepartments.data;
  }

  try {
    const depts = await prisma.mDepartemen.findMany({
      where: { isActive: 1 },
      orderBy: { urutan: "asc" },
      select: {
        idDepartemen: true,
        namaDepartemen: true,
        slug: true,
        deskripsiSingkat: true,
        tupoksiUtama: true,
        visi: true,
        misi: true,
        isActive: true,
        urutan: true,
        proker: {
          where: { status: "published" },
          select: { idProker: true },
        },
        kepengurusan: {
          where: { status: "aktif" },
          select: { idKepengurusan: true },
        },
      },
    });

    const result = depts.map((d) => ({
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

    cachedDepartments = { data: result, expiry: now + DEPT_TTL_MS };
    return result;
  } catch (err) {
    console.warn("Notice: failed to load departments:", err);
    return cachedDepartments ? cachedDepartments.data : [];
  }
});

export const getPublicDepartmentBySlug = cache(async function getPublicDepartmentBySlug(slug: string) {
  try {
    const dept = await prisma.mDepartemen.findFirst({
      where: { slug, isActive: 1 },
      select: {
        idDepartemen: true,
        namaDepartemen: true,
        slug: true,
        deskripsiSingkat: true,
        tupoksiUtama: true,
        visi: true,
        misi: true,
        kepengurusan: {
          where: { status: "aktif" },
          select: {
            anggota: {
              select: {
                idPerisai: true,
                namaLengkap: true,
                linkedin: true,
                instagram: true,
                fotoUrl: true,
              },
            },
            jabatan: {
              select: {
                namaJabatan: true,
              },
            },
          },
          orderBy: { urutan: "asc" },
        },
        proker: {
          where: { status: "published" },
          select: {
            idProker: true,
            namaProker: true,
            slug: true,
            deskripsi: true,
          },
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
      members: dept.kepengurusan
        .filter((k) => Boolean(k.anggota))
        .map((k) => ({
          id: k.anggota?.idPerisai || "",
          name: k.anggota?.namaLengkap || "Anggota",
          position: k.jabatan?.namaJabatan || "Pengurus",
          linkedinUrl: k.anggota?.linkedin || null,
          instagramUsername: k.anggota?.instagram || null,
          photoUrl: k.anggota?.fotoUrl || null,
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
});
