import { getAdminDepartments } from "@/features/departments/queries.admin";
import { getAdminPeriods } from "@/features/periods/queries.admin";
import { WorkProgramForm } from "@/features/work-programs/components/WorkProgramForm";

export default async function AdminNewWorkProgramPage() {
  const [departments, periods] = await Promise.all([
    getAdminDepartments(),
    getAdminPeriods(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Tambah Program Kerja Baru
        </h1>
        <p className="text-sm text-zinc-500">
          Daftarkan agenda proker baru di bawah departemen dan periode terkait.
        </p>
      </div>

      <WorkProgramForm departments={departments} periods={periods} />
    </div>
  );
}
