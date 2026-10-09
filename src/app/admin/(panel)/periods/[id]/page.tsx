import { notFound } from "next/navigation";
import { getAdminPeriodById } from "@/features/periods/queries.admin";
import { PeriodForm } from "@/features/periods/components/PeriodForm";

export default async function AdminEditPeriodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const period = await getAdminPeriodById(id);

  if (!period) {
    notFound();
  }

  const initialData = {
    id: period.id,
    name: period.name,
    isActive: Boolean(period.isCurrent),
    startDate: new Date(period.startDate * 1000).toISOString().split("T")[0],
    endDate: period.endDate ? new Date(period.endDate * 1000).toISOString().split("T")[0] : null,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Ubah Periode Kepengurusan
        </h1>
        <p className="text-sm text-zinc-500">
          Perbarui nama periode, rentang tanggal, visi, atau misi kepengurusan.
        </p>
      </div>

      <PeriodForm initialData={initialData} />
    </div>
  );
}
