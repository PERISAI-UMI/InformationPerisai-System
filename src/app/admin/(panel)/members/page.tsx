import Link from "next/link";
import { getAdminMembers } from "@/features/members/queries.admin";
import { MemberTable } from "@/features/members/components/MemberTable";

import { Pagination } from "@/components/common/Pagination";

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ periodId?: string; page?: string }>;
}) {
  const { periodId, page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminMembers({ periodId, page, pageSize: 8 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kelola Anggota Pengurus
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Daftar pengurus, BPH, dan fungsionaris departemen UKM PERISAI UMI.
          </p>
        </div>
        <Link
          href="/admin/members/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 transition-all"
        >
          <span>+</span>
          <span>Tambah Pengurus Baru</span>
        </Link>
      </div>

      <MemberTable
        members={data.items.map((m) => ({
          id: m.id,
          name: m.name,
          roleOrTitle: m.roleOrTitle,
          isActive: m.isActive,
          department: m.department ? { name: m.department.nama } : null,
          period: m.period ? { name: m.period.name } : null,
        }))}
      />

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        createPageUrl={(p) => {
          const params = new URLSearchParams();
          if (periodId) params.set("periodId", periodId);
          params.set("page", String(p));
          return `/admin/members?${params.toString()}`;
        }}
      />
    </div>
  );
}
