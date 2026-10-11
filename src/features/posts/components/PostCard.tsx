import Link from "next/link";
import Image from "next/image";
import { formatDateIndonesian } from "@/lib/dates";

export interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    category?: string | null;
    excerpt?: string | null;
    coverImageUrl?: string | null;
    publishedAt?: Date | string | null;
    isFeatured?: boolean;
    department?: { id: string; name: string } | null;
    author?: { name: string } | null;
    readTime?: number;
  };
  hrefPrefix?: string; // default "/activity"
}

export function PostCard({ post, hrefPrefix = "/activity" }: PostCardProps) {
  const destination = `${hrefPrefix}/${post.slug}`;
  const categoryLabel = post.category || "Kegiatan";
  const authorName = post.department?.name || post.author?.name || "PERISAI UMI";
  const readTimeMinutes = post.readTime || 3;

  // Cek apakah ada custom image (bukan default /og-default.jpg)
  const hasCustomImage = Boolean(
    post.coverImageUrl &&
      !post.coverImageUrl.includes("og-default") &&
      !post.coverImageUrl.endsWith("default.jpg") &&
      (post.coverImageUrl.startsWith("http") ||
        post.coverImageUrl.startsWith("/uploads") ||
        post.coverImageUrl.startsWith("/images"))
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#202026] shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FFB22C]/60 hover:shadow-[0_0_30px_rgba(255,178,44,0.18)]">
      {/* Bagian Visual Header Card: Menggunakan Style Obsidian Gold Emblem Seperti di Dashboard */}
      <Link href={destination} className="relative block w-full overflow-hidden">
        {hasCustomImage ? (
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-zinc-900">
            <Image
              src={post.coverImageUrl!}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#202026] via-transparent to-black/30" />
            {/* Category Badge */}
            <div className="absolute left-2.5 top-2.5 z-10">
              <span className="truncate max-w-[105px] sm:max-w-[150px] rounded-full border border-[#FFB22C]/40 bg-[#1b1b1f]/85 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FFB22C] shadow-md backdrop-blur-md">
                {categoryLabel}
              </span>
            </div>
            {post.isFeatured && (
              <div className="absolute right-2.5 top-2.5 z-10">
                <span className="flex items-center gap-1 rounded-full bg-[#FFB22C] px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-extrabold uppercase text-[#1b1b1f] shadow-[0_0_12px_rgba(255,178,44,0.4)]">
                  <span>★</span> <span className="hidden sm:inline">Unggulan</span>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-gradient-to-b from-[#25252c] to-[#1c1c22] flex flex-col justify-between p-2.5 sm:p-4">
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-[#FFB22C]/15 blur-xl group-hover:bg-[#FFB22C]/25 transition-all duration-500" />
            <div className="pointer-events-none absolute -left-6 -bottom-6 h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-[#FFA000]/10 blur-xl" />

            {/* Watermark SVG Icon */}
            <div className="pointer-events-none absolute right-1 bottom-1 sm:right-2 sm:bottom-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity select-none text-zinc-100">
              <svg className="h-16 w-16 sm:h-24 sm:w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>

            {/* Top Row: Category Tag & Sparkle / Featured */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <span className="truncate max-w-[105px] sm:max-w-[150px] rounded-full border border-[#FFB22C]/40 bg-[#1b1b1f]/85 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FFB22C] shadow-md backdrop-blur-md">
                {categoryLabel}
              </span>

              {post.isFeatured ? (
                <span className="flex items-center gap-1 rounded-full bg-[#FFB22C] px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-extrabold uppercase text-[#1b1b1f] shadow-[0_0_12px_rgba(255,178,44,0.4)]">
                  <span>★</span> <span className="hidden sm:inline">Unggulan</span>
                </span>
              ) : (
                <span className="text-[10px] sm:text-xs text-[#FFB22C] opacity-80 group-hover:scale-125 transition-transform">
                  ✦
                </span>
              )}
            </div>

            {/* Center Emblem: Minimalist Obsidian Gold Vector Icon Box */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center py-1">
              <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl border border-[#FFB22C]/30 bg-[#FFB22C]/10 text-[#FFB22C] shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-[#FFB22C]/60 group-hover:bg-[#FFB22C]/20 group-hover:shadow-[0_0_20px_rgba(255,178,44,0.3)]">
                <svg className="h-5 w-5 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </Link>

      {/* Bagian Konten Card */}
      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-5">
        <div>
          {/* Metadata: Tanggal & Read Time */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#FFB22C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{post.publishedAt ? formatDateIndonesian(post.publishedAt) : "Terbaru"}</span>
            </span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="hidden sm:flex items-center gap-1 text-zinc-400">
              <svg className="h-3.5 w-3.5 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readTimeMinutes} min
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-1.5 sm:mt-2.5 text-xs sm:text-base font-bold leading-tight sm:leading-snug text-white transition-colors duration-200 group-hover:text-[#FFB22C] line-clamp-2">
            <Link href={destination}>{post.title}</Link>
          </h3>

          {/* Excerpt: Disembunyikan di HP agar card 2-kolom ringkas & sejajar rapi */}
          {post.excerpt && (
            <p className="mt-2 hidden sm:block text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-2 font-normal">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Footer Meta & Action Link */}
        <div className="mt-2.5 sm:mt-5 flex items-center justify-between border-t border-white/10 pt-2 sm:pt-3 text-[10px] sm:text-xs">
          <span className="flex items-center gap-1 text-zinc-400 truncate max-w-[100px] sm:max-w-[170px]" title={authorName}>
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#FFB22C] shrink-0" />
            <span className="truncate">{authorName}</span>
          </span>

          <Link
            href={destination}
            className="flex items-center gap-1 font-bold text-[#FFB22C] transition-all hover:text-[#FFC85A] shrink-0"
          >
            <span className="hidden sm:inline">Baca</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
