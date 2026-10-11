import Link from "next/link";
import Image from "next/image";
import { formatDateIndonesian } from "@/lib/dates";

export interface OpportunityCardProps {
  opportunity: {
    id: string;
    type: string;
    title: string;
    slug: string;
    category?: string | null;
    tingkat?: string | null;
    organizer?: string | null;
    description?: string | null;
    deadlineAt?: Date | string | null;
    registrationUrl?: string | null;
    coverImageUrl?: string | null;
    isOpen?: boolean;
    daysLeft?: number | null;
    isUrgent?: boolean;
  };
  hrefPrefix?: string; // default "/competition"
}

export function OpportunityCard({
  opportunity,
  hrefPrefix = "/competition",
}: OpportunityCardProps) {
  const destination = `${hrefPrefix}/${opportunity.slug}`;
  const typeLabel = (opportunity.type || "LOMBA").toUpperCase();
  const categoryLabel = opportunity.category || "KOMPETISI";
  const organizerLabel = opportunity.organizer || "PERISAI UMI";
  const isOpen = opportunity.isOpen ?? true;
  const daysLeft = opportunity.daysLeft;
  const isUrgent = opportunity.isUrgent ?? false;

  // Cek apakah ada custom image (bukan default /og-default.jpg)
  const hasCustomImage = Boolean(
    opportunity.coverImageUrl &&
      !opportunity.coverImageUrl.includes("og-default") &&
      !opportunity.coverImageUrl.endsWith("default.jpg") &&
      (opportunity.coverImageUrl.startsWith("http") ||
        opportunity.coverImageUrl.startsWith("/uploads") ||
        opportunity.coverImageUrl.startsWith("/images"))
  );

  return (
    <article className="group flex flex-col h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#202026] shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FFB22C]/60 hover:shadow-[0_0_30px_rgba(255,178,44,0.18)]">
      {/* Bagian Visual Header Card: Menggunakan Style Obsidian Gold Emblem Seperti di Dashboard */}
      <Link href={destination} className="relative block w-full overflow-hidden">
        {hasCustomImage ? (
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-zinc-900">
            <Image
              src={opportunity.coverImageUrl!}
              alt={opportunity.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#202026] via-transparent to-black/30" />

            {/* Top-Left: Type Badge */}
            <div className="absolute left-2.5 top-2.5 z-10">
              <span className="truncate max-w-[105px] sm:max-w-[150px] rounded-full border border-[#FFB22C]/40 bg-[#1b1b1f]/85 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FFB22C] shadow-md backdrop-blur-md">
                {typeLabel}
              </span>
            </div>

            {/* Top-Right: Status / Countdown Badge */}
            <div className="absolute right-2.5 top-2.5 z-10">
              {!isOpen ? (
                <span className="rounded-full border border-white/10 bg-zinc-800/90 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-zinc-400 backdrop-blur-md">
                  Ditutup
                </span>
              ) : isUrgent ? (
                <span className="flex items-center gap-1 rounded-full border border-red-500/50 bg-red-950/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)] backdrop-blur-md animate-pulse">
                  <span>⏰</span> Sisa {daysLeft} Hari!
                </span>
              ) : daysLeft !== null && daysLeft !== undefined ? (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)] backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Sisa {daysLeft} Hari
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full border border-[#FFB22C]/40 bg-[#1b1b1f]/90 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-[#FFB22C] backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFB22C]" /> Terbuka
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-gradient-to-b from-[#25252c] to-[#1c1c22] flex flex-col justify-between p-2.5 sm:p-4">
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-[#FFB22C]/15 blur-xl group-hover:bg-[#FFB22C]/25 transition-all duration-500" />
            <div className="pointer-events-none absolute -left-6 -bottom-6 h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-[#FFA000]/10 blur-xl" />

            {/* Watermark SVG Trophy Icon */}
            <div className="pointer-events-none absolute right-1 bottom-1 sm:right-2 sm:bottom-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity select-none text-zinc-100">
              <svg className="h-16 w-16 sm:h-24 sm:w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.003 0H9.497m5.003 0a7.5 7.5 0 00-5.003 0M12 3v3.75m-6.75 3a4.5 4.5 0 019 0v.75H5.25v-.75z" />
              </svg>
            </div>

            {/* Top Row: Type Tag & Status / Countdown Badge */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <span className="truncate max-w-[105px] sm:max-w-[150px] rounded-full border border-[#FFB22C]/40 bg-[#1b1b1f]/85 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FFB22C] shadow-md backdrop-blur-md">
                {typeLabel}
              </span>

              {!isOpen ? (
                <span className="rounded-full border border-white/10 bg-zinc-800/90 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-zinc-400 backdrop-blur-md">
                  Ditutup
                </span>
              ) : isUrgent ? (
                <span className="flex items-center gap-1 rounded-full border border-red-500/50 bg-red-950/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)] backdrop-blur-md animate-pulse">
                  <span>⏰</span> Sisa {daysLeft} Hari!
                </span>
              ) : daysLeft !== null && daysLeft !== undefined ? (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)] backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Sisa {daysLeft} Hari
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full border border-[#FFB22C]/40 bg-[#1b1b1f]/90 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-[#FFB22C] backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFB22C]" /> Terbuka
                </span>
              )}
            </div>

            {/* Center Emblem: Minimalist Obsidian Gold Vector Trophy Box */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center py-1">
              <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl border border-[#FFB22C]/30 bg-[#FFB22C]/10 text-[#FFB22C] shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-[#FFB22C]/60 group-hover:bg-[#FFB22C]/20 group-hover:shadow-[0_0_20px_rgba(255,178,44,0.3)]">
                <svg className="h-5 w-5 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.003 0H9.497m5.003 0a7.5 7.5 0 00-5.003 0M12 3v3.75m-6.75 3a4.5 4.5 0 019 0v.75H5.25v-.75z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </Link>

      {/* Bagian Konten Card */}
      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-5">
        <div>
          {/* Metadata: Kategori & Penyelenggara */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[#FFB22C] truncate max-w-[110px] sm:max-w-[150px]">
              {categoryLabel}
            </span>
            <span className="flex items-center gap-1 text-zinc-400 truncate max-w-[110px] sm:max-w-[160px]" title={organizerLabel}>
              <svg className="h-3 w-3 text-zinc-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{organizerLabel}</span>
            </span>
          </div>

          {/* Title: 2 baris konsisten dengan min-height */}
          <h3 className="mt-1.5 sm:mt-2.5 text-xs sm:text-base font-bold leading-tight sm:leading-snug text-white transition-colors duration-200 group-hover:text-[#FFB22C] line-clamp-2-clean sm:min-h-[2.75rem]">
            <Link href={destination}>{opportunity.title}</Link>
          </h3>

          {/* Description: Dibatasi maksimal 2 baris dengan ellipsis agar ukuran card selalu presisi dan seragam */}
          {opportunity.description ? (
            <p className="mt-2 hidden sm-line-clamp-2-clean text-xs sm:text-sm leading-relaxed text-zinc-400 font-normal sm:min-h-[2.5rem]">
              {opportunity.description.replace(/<[^>]*>/g, "")}
            </p>
          ) : (
            <div className="mt-2 hidden sm:block sm:min-h-[2.5rem]" aria-hidden />
          )}

          {/* Tenggat Waktu Alert Box */}
          <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-white/5 bg-white/5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-zinc-300">
            <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#FFB22C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">
              Tenggat:{" "}
              <strong className="text-white">
                {opportunity.deadlineAt
                  ? formatDateIndonesian(opportunity.deadlineAt)
                  : "Hingga Kuota Penuh"}
              </strong>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-3 sm:mt-5 flex items-center justify-between border-t border-white/10 pt-2.5 sm:pt-4 text-[10px] sm:text-xs">
          <Link
            href={destination}
            className="font-bold text-[#FFB22C] hover:text-[#FFC85A] transition flex items-center gap-1"
          >
            <span>Panduan & Detail</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>

          {opportunity.registrationUrl && isOpen && (
            <a
              href={opportunity.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#FFB22C]/40 bg-[#FFB22C]/10 px-2.5 py-1 font-bold text-[#FFB22C] hover:bg-[#FFB22C] hover:text-[#1b1b1f] transition duration-200"
            >
              <span>Daftar</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
