import Link from "next/link";
import { getAdminMembers } from "@/features/members/queries.admin";
import { MemberTable } from "@/features/members/components/MemberTable";

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ periodId?: string }>;
}) {
  const { periodId } = await searchParams;
  const members = await getAdminMembers({ periodId });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Kelola Anggota Pengurus
          </h1>
          <p className="text-sm text-zinc-500">
            Daftar pengurus, BPH, dan fungsionaris departemen UKM PERISAI UMI.
          </p>
        </div>
        <Link
          href="/admin/members/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-4 py-2 text-sm font-bold text-[#282F44] shadow-sm hover:bg-[#F5D061] transition"
        >
          + Tambah Pengurus Baru
        </Link>
      </div>

      <MemberTable
        members={members.map((m) => ({
          id: m.id,
          name: m.name,
          roleOrTitle: m.roleOrTitle,
          isActive: m.isActive,
          department: m.department ? { name: m.department.nama } : null,
          period: m.period ? { name: m.period.name } : null,
        }))}
      />
    </div>
  );
}
