import { cache } from "react";
import prisma from "@/lib/db";

export interface PublicMemberItem {
  id: string;
  name: string;
  position: string;
  tier: string;
  photoUrl: string | null;
  linkedinUrl: string | null;
  instagramUsername?: string | null;
  department: { id: string; name: string } | null;
  orderIndex: number;
}

let cachedMembers: { data: PublicMemberItem[]; expiry: number } | null = null;
const MEMBERS_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const getPublicActiveMembers = cache(async function getPublicActiveMembers(): Promise<PublicMemberItem[]> {
  const now = Date.now();
  if (cachedMembers && cachedMembers.expiry > now) {
    return cachedMembers.data;
  }

  try {
    // Eksekusi query Pembina dan Fungsionaris secara paralel untuk memangkas latensi SSR
    const [pembinaList, kepengurusan] = await Promise.all([
      prisma.mPembina
        .findMany({
          where: { isActive: 1 },
          orderBy: { urutan: "asc" },
          select: {
            idPembina: true,
            nama: true,
            gelar: true,
            jabatan: true,
            kategori: true,
            fotoUrl: true,
            linkedin: true,
            urutan: true,
          },
        })
        .catch((err) => {
          console.warn("Notice: failed to load M_Pembina:", err);
          return [];
        }),

      prisma
        .$queryRaw<
          Array<{
            id_perisai: string;
            nama_lengkap: string;
            nama_jabatan: string;
            foto_url: string | null;
            linkedin: string | null;
            instagram: string | null;
            singkatan: string | null;
            nama_dept: string | null;
            slug_dept: string | null;
            level_hirarki: number;
            urutan: number;
          }>
        >`
          SELECT 
            a.id_perisai, a.nama_lengkap, j.nama_jabatan, a.foto_url, a.linkedin, a.instagram,
            d.singkatan, d.nama_departemen as nama_dept, d.slug as slug_dept, j.level_hirarki, k.urutan
          FROM T_Kepengurusan k
          JOIN M_Anggota a ON k.id_perisai = a.id_perisai
          JOIN M_Jabatan j ON k.id_jabatan = j.id_jabatan
          LEFT JOIN M_Departemen d ON k.id_departemen = d.id_departemen
          JOIN M_Periode p ON k.id_periode = p.id_periode
          WHERE p.is_active = 1
          ORDER BY k.urutan ASC
        `
        .catch((err) => {
          console.error("Gagal mengambil fungsionaris aktif:", err);
          return [];
        }),
    ]);

    const pembinaMembers = pembinaList.map((p, idx) => ({
      id: String(p.idPembina),
      name: p.nama + (p.gelar ? `, ${p.gelar}` : ""),
      position: p.jabatan,
      tier: (p.kategori || "pembina").toLowerCase(),
      photoUrl: p.fotoUrl || null,
      linkedinUrl: p.linkedin || null,
      department: null,
      orderIndex: p.urutan || idx,
    }));

    if (kepengurusan && kepengurusan.length > 0) {
      const pengurusMembers = kepengurusan.map((k) => {
        let tier: "inti" | "kadep" | "staf" = "staf";
        if (k.level_hirarki <= 2) {
          tier = "inti";
        } else if (k.level_hirarki === 3) {
          tier = "kadep";
        }

        const deptName = k.nama_dept || k.singkatan || "";
        const posTitle =
          k.nama_jabatan +
          (k.singkatan && k.level_hirarki > 2 ? ` ${k.singkatan}` : "");

        return {
          id: k.id_perisai,
          name: k.nama_lengkap,
          position: posTitle,
          tier,
          photoUrl: k.foto_url || null,
          linkedinUrl: k.linkedin || null,
          instagramUsername: k.instagram || null,
          department: k.slug_dept ? { id: k.slug_dept, name: deptName } : null,
          orderIndex: k.urutan,
        };
      });

      const result = [...pembinaMembers, ...pengurusMembers];
      cachedMembers = { data: result, expiry: now + MEMBERS_TTL_MS };
      return result;
    }

    cachedMembers = { data: pembinaMembers, expiry: now + MEMBERS_TTL_MS };
    return pembinaMembers;
  } catch (err) {
    console.error("Gagal memuat anggota publik:", err);
    if (cachedMembers?.data) {
      return cachedMembers.data;
    }
    return [];
  }
});
