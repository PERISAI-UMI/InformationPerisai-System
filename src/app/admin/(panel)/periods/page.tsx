import Link from "next/link";
import { getAdminPeriods } from "@/features/periods/queries.admin";
import { PeriodTable } from "@/features/periods/components/PeriodTable";

export default async function AdminPeriodsPage() {
  const periods = await getAdminPeriods();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Kelola Periode Kepengurusan
          </h1>
          <p className="text-sm text-zinc-500">
            Daftar masa bakti kepengurusan. Tepat satu periode yang berstatus aktif.
          </p>
        </div>
        <Link
          href="/admin/periods/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-4 py-2 text-sm font-bold text-[#282F44] shadow-sm hover:bg-[#F5D061] transition"
        >
          + Tambah Periode Baru
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
