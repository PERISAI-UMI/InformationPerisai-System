import Link from "next/link";
import { getAdminDepartments } from "@/features/departments/queries.admin";
import { DepartmentTable } from "@/features/departments/components/DepartmentTable";
import { requirePermission } from "@/lib/permissions";

export default async function AdminDepartmentsPage() {
  await requirePermission("departments:read");
  const departments = await getAdminDepartments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kelola Departemen
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Daftar bidang, biro, dan departemen fungsionaris di UKM PERISAI UMI.
          </p>
        </div>
        <Link
          href="/admin/departments/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 transition-all"
        >
          <span>+</span>
          <span>Tambah Departemen Baru</span>
        </Link>
      </div>

      <DepartmentTable departments={departments} />
    </div>
  );
}
