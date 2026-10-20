import Link from "next/link";
import { getAdminStatistics } from "@/features/statistics/queries.admin";
import { StatisticTable } from "@/features/statistics/components/StatisticTable";
import { requirePermission } from "@/lib/permissions.server";
import { hasPermission } from "@/lib/permissions";

export default async function AdminStatisticsPage() {
  const session = await requirePermission("settings:read");
  const user = session.user;
  const canUpdate = hasPermission(user, "settings:update");

  const statistics = await getAdminStatistics();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kelola Indikator Statistik
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Angka capaian, prestasi medali, dan statistik yang ditampilkan di beranda publik.
          </p>
        </div>
        {canUpdate && (
          <Link
            href="/admin/statistics/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 transition-all"
          >
            <span>+</span>
            <span>Tambah Statistik Baru</span>
          </Link>
        )}
      </div>

      <StatisticTable
        statistics={statistics.map((s) => {
          const rawVal = String(s.value ?? "0");
          return {
            id: s.id,
            label: s.label,
            value: parseInt(rawVal.replace(/[^0-9]/g, "") || "0", 10),
            suffix: rawVal.replace(/[0-9]/g, "").trim() || null,
            icon: s.description,
            orderIndex: s.sortOrder,
            isActive: Boolean(s.isActive),
          };
        })}
        canUpdate={canUpdate}
      />
    </div>
  );
}
