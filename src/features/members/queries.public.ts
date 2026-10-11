import prisma from "@/lib/db";

export async function getPublicActiveMembers() {
  // 1. Ambil dewan pembina dari M_Pembina
  let pembinaMembers: any[] = [];
  try {
    const pembinaList = await prisma.mPembina.findMany({
      where: { isActive: 1 },
      orderBy: { urutan: "asc" },
    });
    pembinaMembers = pembinaList.map((p, idx) => ({
      id: String(p.idPembina),
      name: p.nama + (p.gelar ? `, ${p.gelar}` : ""),
      position: p.jabatan,
      tier: (p.kategori || "pembina").toLowerCase(),
      photoUrl: p.fotoUrl || null,
      linkedinUrl: p.linkedin || null,
      department: null,
      orderIndex: p.urutan || idx,
    }));
  } catch (err) {
    console.warn("Notice: failed to load M_Pembina:", err);
    pembinaMembers = [];
  }

  // 2. Ambil fungsionaris aktif dari T_Kepengurusan & M_Anggota
  try {
    const kepengurusan = await prisma.$queryRaw<Array<{
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
    }>>`
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
    `;

    if (kepengurusan && kepengurusan.length > 0) {
      const pengurusMembers = kepengurusan.map((k) => {
        let tier: "inti" | "kadep" | "staf" = "staf";
        if (k.level_hirarki <= 2) {
          tier = "inti";
        } else if (k.level_hirarki === 3) {
          tier = "kadep";
        }

        const deptName = k.nama_dept || k.singkatan || "";
        const posTitle = k.nama_jabatan + (k.singkatan && k.singkatan !== "BPH" ? ` ${k.singkatan}` : "");

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

      return [...pembinaMembers, ...pengurusMembers];
    }
  } catch (err) {
    console.error("Gagal mengambil fungsionaris aktif:", err);
  }

  return pembinaMembers;
}
