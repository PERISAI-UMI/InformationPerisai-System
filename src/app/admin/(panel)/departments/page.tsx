import Link from "next/link";
import { getAdminDepartments } from "@/features/departments/queries.admin";
import { DepartmentTable } from "@/features/departments/components/DepartmentTable";

export default async function AdminDepartmentsPage() {
  const departments = await getAdminDepartments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Kelola Departemen
          </h1>
          <p className="text-sm text-zinc-500">
            Daftar bidang dan divisi internal di UKM PERISAI UMI.
          </p>
        </div>
        <Link
          href="/admin/departments/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-4 py-2 text-sm font-bold text-[#282F44] shadow-sm hover:bg-[#F5D061] transition"
        >
          + Tambah Departemen Baru
        </Link>
      </div>

      <DepartmentTable departments={departments} />
    </div>
  );
}
