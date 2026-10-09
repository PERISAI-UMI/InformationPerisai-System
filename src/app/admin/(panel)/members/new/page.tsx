import { getAdminPeriods } from "@/features/periods/queries.admin";
import { getAdminDepartments } from "@/features/departments/queries.admin";
import { MemberForm } from "@/features/members/components/MemberForm";

export default async function AdminNewMemberPage() {
  const [periods, departments] = await Promise.all([
    getAdminPeriods(),
    getAdminDepartments(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Tambah Pengurus Baru
        </h1>
        <p className="text-sm text-zinc-500">
          Masukkan profil fungsionaris pengurus untuk periode aktif atau terdahulu.
        </p>
      </div>

      <MemberForm periods={periods} departments={departments} />
    </div>
  );
}
