import Link from "next/link";
import { getAdminOpportunities } from "@/features/opportunities/queries.admin";
import { OpportunityTable } from "@/features/opportunities/components/OpportunityTable";
import { Pagination } from "@/components/common/Pagination";

export default async function AdminOpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminOpportunities({ page });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Kelola Peluang & Kompetisi
          </h1>
          <p className="text-sm text-zinc-500">
            Daftar lomba, seminar, dan beasiswa untuk disebarluaskan ke mahasiswa.
          </p>
        </div>
        <Link
          href="/admin/opportunities/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-4 py-2 text-sm font-bold text-[#282F44] shadow-sm hover:bg-[#F5D061] transition"
        >
          + Tambah Peluang Baru
        </Link>
      </div>

      <OpportunityTable
        opportunities={data.items.map((op) => ({
          id: op.id,
          title: op.title,
          slug: op.slug,
          organizer: op.organizer || "PERISAI UMI",
          category: op.category || "LOMBA",
          deadlineAt: op.deadlineAt ? new Date(op.deadlineAt * 1000) : new Date(),
        }))}
      />

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        createPageUrl={(p) => `/admin/opportunities?page=${p}`}
      />
    </div>
  );
}
