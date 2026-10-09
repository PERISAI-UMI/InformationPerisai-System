import Link from "next/link";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { formatDateIndonesian } from "@/lib/dates";

export interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImageUrl?: string | null;
    publishedAt?: Date | string | null;
    author?: { name: string } | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/kabar/${post.slug}`} className="block overflow-hidden">
        <ResponsiveImage
          src={post.coverImageUrl}
          alt={post.title}
          aspectRatio="video"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{post.publishedAt ? formatDateIndonesian(post.publishedAt) : "Baru"}</span>
            {post.author && <span>• {post.author.name}</span>}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-zinc-900 group-hover:text-[#E6AF2E] transition dark:text-zinc-100">
            <Link href={`/kabar/${post.slug}`}>{post.title}</Link>
          </h3>
          {post.excerpt && (
            <p className="mt-2 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">
              {post.excerpt}
            </p>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href={`/kabar/${post.slug}`}
            className="text-xs font-bold text-[#E6AF2E] hover:text-[#b8861b] dark:text-[#F5D061]"
          >
            Baca Selengkapnya →
          </Link>
        </div>
      </div>
    </article>
  );
}
