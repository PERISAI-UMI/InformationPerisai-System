import Link from "next/link";
import { getAdminStatistics } from "@/features/statistics/queries.admin";
import { StatisticTable } from "@/features/statistics/components/StatisticTable";

export default async function AdminStatisticsPage() {
  const statistics = await getAdminStatistics();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Kelola Indikator Statistik
          </h1>
          <p className="text-sm text-zinc-500">
            Angka capaian, prestasi medali, dan statistik yang ditampilkan di beranda publik.
          </p>
        </div>
        <Link
          href="/admin/statistics/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-4 py-2 text-sm font-bold text-[#282F44] shadow-sm hover:bg-[#F5D061] transition"
        >
          + Tambah Statistik Baru
        </Link>
      </div>

      <StatisticTable
        statistics={statistics.map((s) => ({
          id: s.id,
          label: s.label,
          value: parseInt(s.value.replace(/[^0-9]/g, "") || "0", 10),
          suffix: s.value.replace(/[0-9]/g, "").trim() || null,
          icon: s.description,
          orderIndex: s.sortOrder,
          isActive: Boolean(s.isActive),
        }))}
      />
    </div>
  );
}
