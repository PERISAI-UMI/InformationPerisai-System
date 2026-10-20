import Link from "next/link";
import { getAdminPeriods } from "@/features/periods/queries.admin";
import { PeriodTable } from "@/features/periods/components/PeriodTable";
import { requirePermission } from "@/lib/permissions";

export default async function AdminPeriodsPage() {
  await requirePermission("departments:read");
  const periods = await getAdminPeriods();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kelola Periode Kepengurusan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Daftar masa bakti kepengurusan UKM PERISAI UMI (satu periode berstatus aktif).
          </p>
        </div>
        <Link
          href="/admin/periods/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 transition-all"
        >
          <span>+</span>
          <span>Tambah Periode Baru</span>
        </Link>
      </div>

      <PeriodTable
        periods={periods.map((p) => ({
          id: p.id,
          name: p.name,
          isActive: Boolean(p.isCurrent),
          startDate: new Date(p.startDate * 1000),
          endDate: p.endDate ? new Date(p.endDate * 1000) : null,
          _count: {
            members: p._count.members,
            workPrograms: 0,
          },
        }))}
      />
    </div>
  );
}
