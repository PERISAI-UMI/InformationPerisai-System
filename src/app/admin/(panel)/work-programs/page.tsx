import Link from "next/link";
import { getAdminWorkPrograms } from "@/features/work-programs/queries.admin";
import { WorkProgramTable } from "@/features/work-programs/components/WorkProgramTable";
import { Pagination } from "@/components/common/Pagination";

export default async function AdminWorkProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminWorkPrograms({ page });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Kelola Program Kerja
          </h1>
          <p className="text-sm text-zinc-500">
            Daftar seluruh agenda kerja per departemen dan periode kepengurusan.
          </p>
        </div>
        <Link
          href="/admin/work-programs/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-4 py-2 text-sm font-bold text-[#282F44] shadow-sm hover:bg-[#F5D061] transition"
        >
          + Tambah Proker Baru
        </Link>
      </div>

      <WorkProgramTable
        programs={data.items.map((p) => ({
          id: p.id,
          name: p.title,
          slug: p.slug,
          status: p.status,
          department: { name: p.department.nama },
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
