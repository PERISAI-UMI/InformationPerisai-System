import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPostBySlug } from "@/features/posts/queries.public";
import { SafeHtml } from "@/components/common/SafeHtml";
import { formatDateIndonesian } from "@/lib/dates";
import { PostCard } from "@/features/posts/components/PostCard";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Artikel Tidak Ditemukan — UKM PERISAI UMI" };
  }

  return {
    title: `${post.title} — UKM PERISAI UMI`,
    description: post.excerpt || `Dokumentasi dan publikasi ilmiah UKM PERISAI UMI: ${post.title}`,
  };
}

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

  const coverImage = post.coverImageUrl || "/og-default.jpg";
  const authorName = post.department?.name || post.author?.name || "Pengurus PERISAI UMI";

  return (
    <div className="relative min-h-screen bg-[#1b1b1f] text-white selection:bg-[#FFB22C] selection:text-[#1b1b1f]">
      {/* Ambient Top Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-3/4 -translate-x-1/2 blur-3xl opacity-25"
        style={{
          background: "radial-gradient(circle at 50% 0%, #FFB22C 0%, transparent 70%)",
        }}
      />

      <article className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/activity"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-bold text-[#FFB22C] backdrop-blur-sm transition hover:border-[#FFB22C]/40 hover:bg-[#FFB22C]/10"
          >
            <span>←</span>
            <span>Kembali ke Activity</span>
          </Link>

          <span className="rounded-full border border-[#FFB22C]/30 bg-[#FFB22C]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFB22C]">
            {post.category}
          </span>
        </div>

        {/* Header Title & Metadata */}
        <header className="space-y-6">
          <h1 className="text-3xl sm:text-5xl font-black leading-tight text-white tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4 text-xs sm:text-sm text-zinc-400">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFB22C]" />
                <span className="text-zinc-200 font-medium">{authorName}</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{post.publishedAt ? formatDateIndonesian(post.publishedAt) : "Terbaru"}</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{post.readTime} min baca</span>
              </div>
            </div>

            {post.isFeatured && (
              <span className="rounded-full bg-[#FFB22C] px-3 py-1 text-xs font-black uppercase text-[#1b1b1f] shadow-sm">
                ★ Unggulan
              </span>
            )}
          </div>
        </header>

        {/* Cover Banner Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-zinc-900">
          <Image
            src={coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Excerpt Summary Callout */}
        {post.excerpt && (
          <div className="rounded-2xl border-l-4 border-[#FFB22C] bg-[#222228] p-5 sm:p-6 text-zinc-300 text-base italic leading-relaxed shadow-lg">
            &ldquo;{post.excerpt}&rdquo;
          </div>
        )}

        {/* Main Content Body */}
        <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed space-y-6 prose-headings:text-white prose-headings:font-bold prose-a:text-[#FFB22C] prose-a:underline hover:prose-a:text-[#FFC85A] prose-blockquote:border-[#FFB22C] prose-strong:text-white">
          <SafeHtml html={post.content} />
        </div>

        {/* Share and Action Footer */}
        <div className="rounded-2xl border border-white/10 bg-[#222228] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            <span className="text-zinc-400">Bagikan artikel ini ke rekan mahasiswa:</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + " - ")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-200 hover:border-[#FFB22C] hover:text-[#FFB22C] transition"
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-200 hover:border-[#FFB22C] hover:text-[#FFB22C] transition"
            >
              X / Twitter
            </a>
          </div>
        </div>

        {/* Related Posts Section */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="border-t border-white/10 pt-12 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Kegiatan & Berita Terkait</h3>
                <p className="text-xs text-zinc-400 mt-1">Eksplorasi warta seputar {post.category}</p>
              </div>
              <Link href="/activity" className="text-xs font-bold text-[#FFB22C] hover:underline">
                Lihat Semua Agenda →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {post.relatedPosts.map((related) => (
                <PostCard key={related.id} post={related} hrefPrefix="/activity" />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
