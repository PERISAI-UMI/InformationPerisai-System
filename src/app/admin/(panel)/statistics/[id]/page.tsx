import { notFound } from "next/navigation";
import { getAdminStatisticById } from "@/features/statistics/queries.admin";
import { StatisticForm } from "@/features/statistics/components/StatisticForm";

export default async function AdminEditStatisticPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stat = await getAdminStatisticById(id);

  if (!stat) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Ubah Statistik
        </h1>
        <p className="text-sm text-zinc-500">
          Perbarui nilai angka, label, atau urutan tampilan.
        </p>
      </div>

      <StatisticForm
        initialData={{
          id: stat.id,
          label: stat.label,
          value: parseInt(stat.value.replace(/[^0-9]/g, "") || "0", 10),
          suffix: stat.value.replace(/[0-9]/g, "").trim() || null,
          icon: stat.description,
          orderIndex: stat.sortOrder,
          isActive: Boolean(stat.isActive),
        }}
      />
    </div>
  );
}
