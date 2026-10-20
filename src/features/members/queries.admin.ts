import prisma from "@/lib/db";

export async function getAdminMembers({
  periodId,
  page = 1,
  pageSize = 8,
}: {
  periodId?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const numPeriod = periodId ? parseInt(periodId, 10) : undefined;
  const where = numPeriod && !isNaN(numPeriod) ? { idPeriode: numPeriod } : {};
  const skip = (page - 1) * pageSize;

  const [members, total] = await Promise.all([
    prisma.tKepengurusan.findMany({
      where,
      include: {
        anggota: true,
        jabatan: true,
        departemen: true,
        periode: true,
      },
      orderBy: [{ periode: { tahunMulai: "desc" } }, { urutan: "asc" }],
      skip,
      take: pageSize,
    }),
    prisma.tKepengurusan.count({ where }),
  ]);

  const items = members.map((m) => ({
    id: String(m.idKepengurusan),
    name: m.anggota?.namaLengkap || "Tanpa Nama",
    nim: m.anggota?.nim || "-",
    avatarUrl: m.anggota?.fotoUrl || null,
    roleOrTitle: m.jabatan?.namaJabatan || "Fungsionaris",
    orderIndex: m.urutan,
    isActive: m.status === "aktif",
    department: m.departemen ? { id: String(m.departemen.idDepartemen), name: m.departemen.namaDepartemen, nama: m.departemen.namaDepartemen } : null,
    period: m.periode ? { id: String(m.periode.idPeriode), name: m.periode.namaPeriode } : { id: "-", name: "-" },
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminMemberById(id: string) {
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return null;

  const m = await prisma.tKepengurusan.findUnique({
    where: { idKepengurusan: numId },
    include: {
      anggota: true,
      jabatan: true,
      departemen: true,
      periode: true,
    },
  });

  if (!m) return null;

  return {
    id: String(m.idKepengurusan),
    name: m.anggota?.namaLengkap || "Tanpa Nama",
    nim: m.anggota?.nim || "-",
    avatarUrl: m.anggota?.fotoUrl || null,
    roleOrTitle: m.jabatan?.namaJabatan || "Fungsionaris",
    orderIndex: m.urutan,
    isActive: m.status === "aktif",
    department: m.departemen ? { id: String(m.departemen.idDepartemen), name: m.departemen.namaDepartemen } : null,
    period: m.periode ? { id: String(m.periode.idPeriode), name: m.periode.namaPeriode } : { id: "-", name: "-" },
    departmentId: m.idDepartemen ? String(m.idDepartemen) : null,
    periodId: String(m.idPeriode),
    position: m.jabatan?.namaJabatan || "Fungsionaris",
    tier: m.tier,
    linkedinUrl: m.anggota?.linkedin || null,
  };
}
