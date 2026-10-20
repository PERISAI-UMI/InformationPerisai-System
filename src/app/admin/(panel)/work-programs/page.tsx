import Link from "next/link";
import { getAdminWorkPrograms } from "@/features/work-programs/queries.admin";
import { WorkProgramTable } from "@/features/work-programs/components/WorkProgramTable";
import { Pagination } from "@/components/common/Pagination";
import { requirePermission } from "@/lib/permissions.server";

export default async function AdminWorkProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requirePermission("programs:read");
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminWorkPrograms({ page });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kelola Program Kerja
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Daftar seluruh agenda kerja per departemen dan periode kepengurusan UKM PERISAI UMI.
          </p>
        </div>
        <Link
          href="/admin/work-programs/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 transition-all"
        >
          <span>+</span>
          <span>Tambah Proker Baru</span>
        </Link>
      </div>

      <WorkProgramTable
        programs={data.items.map((p) => ({
          id: p.id,
          name: p.title,
          slug: p.slug,
          status: p.status,
          department: { name: p.department?.nama || "Umum" },
          period: { name: "Periode Berjalan" },
        }))}
      />

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        createPageUrl={(p) => `/admin/work-programs?page=${p}`}
      />
    </div>
  );
}
