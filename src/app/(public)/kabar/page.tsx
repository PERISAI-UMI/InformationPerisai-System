import { getPublishedPosts } from "@/features/posts/queries.public";
import { PostCard } from "@/features/posts/components/PostCard";
import { Pagination } from "@/components/common/Pagination";

export default async function KabarPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getPublishedPosts({ page, pageSize: 9 });

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E6AF2E]">
            Warta & Liputan
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[#282F44] dark:text-zinc-100">
            Kabar PERISAI UMI
          </h1>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Informasi terkini mengenai agenda riset, prestasi kejuaraan, pengumuman ilmiah, dan aktivitas anggota.
          </p>
        </div>

        {data.items.length === 0 ? (
          <div className="text-center text-zinc-500 py-12">
            Belum ada warta berita yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          createPageUrl={(p) => `/kabar?page=${p}`}
        />
      </div>
    </div>
  );
}
