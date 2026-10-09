import prisma from "@/lib/db";

export async function getPublicActiveMembers() {
  // 1. Ambil dewan pembina dari web_extra_people jika ada
  let pembinaMembers: any[] = [];
  try {
    const extraPeople = await prisma.extraPerson.findMany({
      where: { isActive: 1 },
      orderBy: { sortOrder: "asc" },
    });
    pembinaMembers = extraPeople.map((p, idx) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      tier: (p.tier || "pembina").toLowerCase(),
      photoUrl: p.photoMediaId || null,
      linkedinUrl: p.linkedinUrl || null,
      department: null,
      orderIndex: idx,
    }));
  } catch {
    pembinaMembers = [];
  }

  // 2. Ambil dari skema baru T_Kepengurusan & M_Anggota untuk Periode Aktif (2026/2027)
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
    console.warn("Notice: T_Kepengurusan query fallback to legacy users:", err);
  }

  // 3. Fallback ke tabel users lama jika T_Kepengurusan belum tersedia
  try {
    const currentGenSetting = await prisma.setting.findUnique({
      where: { key: "current_generasi" },
    });
    const currentGen = currentGenSetting?.value ? parseInt(currentGenSetting.value, 10) : 10;

    const users = await prisma.user.findMany({
      where: { generasi: currentGen },
      select: {
        id: true,
        namaLengkap: true,
        jabatan: true,
        departmentId: true,
        generasi: true,
        role: true,
        avatarUrl: true,
        linkedinUrl: true,
        instagramUsername: true,
        department: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    const mapTier = (jabatan: string, role: string): "inti" | "kadep" | "staf" => {
      const j = jabatan.toLowerCase();
      if (j.includes("ketua umum") || j.includes("sekretaris") || j.includes("bendahara") || role === "INTI" || role === "SUPER_ADMIN") {
        return "inti";
      }
      if (j.includes("kepala departemen") || j.includes("kadep") || role === "ADMIN") {
        return "kadep";
      }
      return "staf";
    };

    const pengurusMembers = users.map((u, idx) => ({
      id: u.id,
      name: u.namaLengkap,
      position: u.jabatan,
      tier: mapTier(u.jabatan, u.role),
      photoUrl: u.avatarUrl || null,
      linkedinUrl: u.linkedinUrl || null,
      instagramUsername: u.instagramUsername || null,
      department: u.department ? { id: u.department.id, name: u.department.nama } : null,
      orderIndex: idx + 10,
    }));

    return [...pembinaMembers, ...pengurusMembers];
  } catch {
    return pembinaMembers;
  }
}
