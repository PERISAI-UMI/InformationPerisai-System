import prisma from "@/lib/db";

export async function getPublicActiveMembers() {
  // Ambil generasi berjalan dari web_site_settings (default 11)
  const currentGenSetting = await prisma.setting.findUnique({
    where: { key: "current_generasi" },
  });
  const currentGen = currentGenSetting?.value ? parseInt(currentGenSetting.value, 10) : 11;

  // 1. Ambil dewan pembina dari web_extra_people
  const extraPeople = await prisma.extraPerson.findMany({
    where: { isActive: 1 },
    orderBy: { sortOrder: "asc" },
  });

  // 2. Ambil pengurus aktif generasi berjalan dari tabel users (hanya kolom allowlist)
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

  // Petakan ekstra people (pembina)
  const pembinaMembers = extraPeople.map((p, idx) => ({
    id: p.id,
    name: p.name,
    position: p.position,
    tier: (p.tier || "pembina").toLowerCase(),
    photoUrl: p.photoMediaId || null,
    linkedinUrl: p.linkedinUrl || null,
    department: null,
    orderIndex: idx,
  }));

  // Helper untuk menentukan tier pengurus
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
}
