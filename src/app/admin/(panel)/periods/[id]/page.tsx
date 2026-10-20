import { notFound } from "next/navigation";
import { getAdminPeriodById } from "@/features/periods/queries.admin";
import { PeriodForm } from "@/features/periods/components/PeriodForm";

import { parseDate } from "@/lib/dates";

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
 
  const safeDate = (ts: unknown) => {
    const d = parseDate(ts);
    return d ? d.toISOString().split("T")[0] : "";
  };

  const initialData = {
    id: period.id,
    name: period.name,
    isActive: Boolean(period.isCurrent),
    startDate: safeDate(period.startDate),
    endDate: period.endDate ? safeDate(period.endDate) : null,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Ubah Periode Kepengurusan
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Perbarui nama periode, rentang tanggal, visi, atau misi kepengurusan.
        </p>
      </div>

      <PeriodForm initialData={initialData} />
    </div>
  );
}
