import Link from "next/link";
import { getAdminOpportunities } from "@/features/opportunities/queries.admin";
import { OpportunityTable } from "@/features/opportunities/components/OpportunityTable";
import { Pagination } from "@/components/common/Pagination";
import { requirePermission } from "@/lib/permissions";

export default async function AdminOpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requirePermission("opportunities:read");
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminOpportunities({ page });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kelola Peluang & Kompetisi
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Daftar lomba karya tulis ilmiah, PKM, seminar, dan beasiswa untuk mahasiswa.
          </p>
        </div>
        <Link
          href="/admin/opportunities/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 transition-all"
        >
          <span>+</span>
          <span>Tambah Peluang Baru</span>
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
