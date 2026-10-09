import { notFound } from "next/navigation";
import { getAdminWorkProgramById } from "@/features/work-programs/queries.admin";
import { getAdminDepartments } from "@/features/departments/queries.admin";
import { getAdminPeriods } from "@/features/periods/queries.admin";
import { WorkProgramForm } from "@/features/work-programs/components/WorkProgramForm";

export default async function AdminEditWorkProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [proker, departments, periods] = await Promise.all([
    getAdminWorkProgramById(id),
    getAdminDepartments(),
    getAdminPeriods(),
  ]);

  if (!proker) {
    notFound();
  }

  const initialData = {
    id: proker.id,
    name: proker.title,
    slug: proker.slug,
    departmentId: proker.departmentId,
    periodId: periods[0]?.id || "",
    description: proker.content || "",
    objectives: proker.summary,
    targetDate: null,
    status: (["PLANNED", "ONGOING", "COMPLETED", "CANCELLED"].includes(proker.status.toUpperCase())
      ? (proker.status.toUpperCase() as "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED")
      : "PLANNED"),
    coverImageUrl: proker.coverMediaId,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Ubah Program Kerja
        </h1>
        <p className="text-sm text-zinc-500">
          Perbarui status capaian, keterangan, atau rincian proker.
        </p>
      </div>

      <WorkProgramForm
        departments={departments}
        periods={periods}
        initialData={initialData}
      />
    </div>
  );
}
