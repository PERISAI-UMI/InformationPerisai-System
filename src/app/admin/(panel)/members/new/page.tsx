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
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Tambah Pengurus Baru
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Masukkan profil fungsionaris pengurus untuk periode aktif atau terdahulu.
        </p>
      </div>

      <MemberForm periods={periods} departments={departments} />
    </div>
  );
}
