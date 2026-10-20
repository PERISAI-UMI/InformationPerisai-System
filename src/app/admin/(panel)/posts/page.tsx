import Link from "next/link";
import { getAdminPosts } from "@/features/posts/queries.admin";
import { PostTable } from "@/features/posts/components/PostTable";
import { Pagination } from "@/components/common/Pagination";
import { requirePermission } from "@/lib/permissions.server";
import { hasPermission } from "@/lib/permissions";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const session = await requirePermission("posts:read");
  const user = session.user;
  const canCreate = hasPermission(user, "posts:create");
  const canUpdate = hasPermission(user, "posts:update");
  const canDelete = hasPermission(user, "posts:delete");

  const { page: pageStr, q: search } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminPosts({ page, search });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kelola Postingan Berita
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Daftar seluruh rilis berita, artikel ilmiah, dan warta organisasi UKM PERISAI UMI.
          </p>
        </div>
        {canCreate && (
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 transition-all"
          >
            <span>+</span>
            <span>Tambah Postingan Baru</span>
          </Link>
        )}
      </div>

      <PostTable
        posts={data.items.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          status: (p.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT",
          createdAt: new Date(p.createdAt * 1000),
          author: { name: p.department?.nama || "Pengurus" },
        }))}
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        createPageUrl={(p) => `/admin/posts?page=${p}`}
      />
    </div>
  );
}
