import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/features/posts/queries.public";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { SafeHtml } from "@/components/common/SafeHtml";
import { formatDateIndonesian } from "@/lib/dates";
import Link from "next/link";

export default async function KabarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/kabar"
            className="text-xs font-bold text-[#E6AF2E] hover:text-[#b8861b]"
          >
            ← Kembali ke Warta Kabar
          </Link>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-[#282F44] dark:text-zinc-100 leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500">
            <span>{post.publishedAt ? formatDateIndonesian(post.publishedAt) : "Baru"}</span>
            {post.author && <span>• Ditulis oleh {post.author.name}</span>}
          </div>
        </div>

        {post.coverImageUrl && (
          <ResponsiveImage
            src={post.coverImageUrl}
            alt={post.title}
            aspectRatio="banner"
            className="rounded-2xl"
          />
        )}

        <div className="pt-4">
          <SafeHtml html={post.content} className="text-base leading-relaxed" />
        </div>
      </div>
    </article>
  );
}
