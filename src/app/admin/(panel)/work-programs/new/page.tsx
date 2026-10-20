import { getAdminDepartments } from "@/features/departments/queries.admin";
import { getAdminPeriods } from "@/features/periods/queries.admin";
import { WorkProgramForm } from "@/features/work-programs/components/WorkProgramForm";
import { requirePermission } from "@/lib/permissions.server";

export default async function AdminNewWorkProgramPage() {
  await requirePermission("programs:create");
  const [departments, periods] = await Promise.all([
    getAdminDepartments(),
    getAdminPeriods(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Tambah Program Kerja Baru
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Daftarkan agenda proker baru di bawah departemen dan periode terkait.
        </p>
      </div>

      <WorkProgramForm departments={departments} periods={periods} />
    </div>
  );
}
