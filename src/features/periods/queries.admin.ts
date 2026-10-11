import prisma from "@/lib/db";

export async function getAdminPeriods() {
  const periods = await prisma.mPeriode.findMany({
    orderBy: { tahunMulai: "desc" },
    include: {
      _count: {
        select: { kepengurusan: true },
      },
    },
  });

  return periods.map((p) => ({
    id: String(p.idPeriode),
    name: p.namaPeriode,
    startDate: p.tahunMulai,
    endDate: p.tahunSelesai,
    isCurrent: p.isActive,
    _count: { members: p._count.kepengurusan },
  }));
}

export async function getAdminPeriodById(id: string) {
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return null;

  const p = await prisma.mPeriode.findUnique({
    where: { idPeriode: numId },
  });

  if (!p) return null;

  return {
    id: String(p.idPeriode),
    name: p.namaPeriode,
    startDate: p.tahunMulai,
    endDate: p.tahunSelesai,
    isCurrent: p.isActive,
  };
}

export async function getActivePeriod() {
  const p = await prisma.mPeriode.findFirst({
    where: { isActive: 1 },
  });

  if (!p) return null;

  return {
    id: String(p.idPeriode),
    name: p.namaPeriode,
    startDate: p.tahunMulai,
    endDate: p.tahunSelesai,
    isCurrent: p.isActive,
  };
}
