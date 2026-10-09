import Link from "next/link";
import { getAdminPosts } from "@/features/posts/queries.admin";
import { PostTable } from "@/features/posts/components/PostTable";
import { Pagination } from "@/components/common/Pagination";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageStr, q: search } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminPosts({ page, search });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Kelola Postingan Berita
          </h1>
          <p className="text-sm text-zinc-500">
            Daftar seluruh rilis berita, artikel ilmiah, dan warta organisasi.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-4 py-2 text-sm font-bold text-[#282F44] shadow-sm hover:bg-[#F5D061] transition"
        >
          + Tambah Postingan Baru
        </Link>
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
      />

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        createPageUrl={(p) => `/admin/posts?page=${p}`}
      />
    </div>
  );
}
