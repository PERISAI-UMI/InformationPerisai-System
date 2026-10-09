import { notFound } from "next/navigation";
import { getAdminMemberById } from "@/features/members/queries.admin";
import { getAdminPeriods } from "@/features/periods/queries.admin";
import { getAdminDepartments } from "@/features/departments/queries.admin";
import { MemberForm } from "@/features/members/components/MemberForm";

export default async function AdminEditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [member, periods, departments] = await Promise.all([
    getAdminMemberById(id),
    getAdminPeriods(),
    getAdminDepartments(),
  ]);

  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Ubah Pengurus
        </h1>
        <p className="text-sm text-zinc-500">
          Perbarui jabatan, status keaktifan, foto profil, atau departemen.
        </p>
      </div>

      <MemberForm
        periods={periods}
        departments={departments}
        initialData={member}
      />
    </div>
  );
}
