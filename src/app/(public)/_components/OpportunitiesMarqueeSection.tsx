import Link from "next/link";
import { GOLD, GOLD_SOFT, BG, Sparkle } from "./visuals";

export interface OpportunityMarqueeItem {
  href: string;
  title: string;
  caption: string;
  tag: string;
  date?: string;
  organizer?: string;
}

interface OpportunitiesMarqueeSectionProps {
  opportunityMarqueeItems: OpportunityMarqueeItem[];
}

export function OpportunitiesMarqueeSection({
  opportunityMarqueeItems,
}: OpportunitiesMarqueeSectionProps) {
  return (
    <section className="relative pb-16 pt-4">
      <Sparkle className="left-[8%] top-8 hidden md:block" size={24} delay={0.8} float />
      <Sparkle className="right-[6%] top-12 hidden md:block" size={22} delay={1.1} />

      <div className="space-y-8">
        <h2
          className="text-center text-4xl font-bold uppercase sm:text-5xl lg:text-6xl"
          style={{ color: GOLD }}
        >
          Info Lomba
        </h2>

        {/* Marquee Ticker Loop ke Kiri dengan Card Default Obsidian */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Gradien fade samping kiri & kanan */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 sm:w-24 lg:w-32"
            style={{
              background: `linear-gradient(to right, ${BG} 0%, transparent 100%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 sm:w-24 lg:w-32"
            style={{
              background: `linear-gradient(to left, ${BG} 0%, transparent 100%)`,
            }}
          />

          <div className="pr-marquee-track-alt">
            {opportunityMarqueeItems.map((card, idx) => (
              <div key={`opp-${idx}`} className="shrink-0 pr-4 sm:pr-6 lg:pr-8">
                <Link
                  href={card.href}
                  className="group relative flex w-52 sm:w-64 md:w-72 lg:w-80 aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-[#FFB22C]/40 bg-gradient-to-br from-[#292931] via-[#202026] to-[#161619] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#FFB22C] hover:shadow-[0_0_35px_rgba(255,178,44,0.22)]"
                >
                  {/* Ambient Corner Glow */}
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#FFB22C]/10 blur-2xl group-hover:bg-[#FFB22C]/20 transition-all duration-500" />
                  <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-[#FFA000]/5 blur-2xl" />

                  {/* Watermark Icon in background */}
                  <div className="pointer-events-none absolute right-3 bottom-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none text-zinc-100">
                    <svg className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75a1.125 1.125 0 01-1.125-1.125V18.75m12.75-9.75v-1.5a3 3 0 00-3-3h-1.5m-9 0H7.5a3 3 0 00-3 3v1.5m0 0a3 3 0 003 3h9a3 3 0 003-3m-15 0v3a6 6 0 006 6h3a6 6 0 006-6v-3" />
                    </svg>
                  </div>

                  {/* Top Row: Category Tag & Status Tag */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                      style={{
                        background: "rgba(27, 27, 31, 0.85)",
                        color: GOLD_SOFT,
                        border: `1px solid ${GOLD}55`,
                      }}
                    >
                      {card.tag}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {card.date || "Terbuka"}
                    </span>
                  </div>

                  {/* Center Emblem: Minimalist Trophy / Award Vector Icon Box */}
                  <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl border border-[#FFB22C]/30 bg-[#FFB22C]/10 text-[#FFB22C] shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-[#FFB22C]/60 group-hover:bg-[#FFB22C]/20 group-hover:shadow-[0_0_20px_rgba(255,178,44,0.25)]">
                      <svg className="h-7 w-7 sm:h-9 sm:w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75a1.125 1.125 0 01-1.125-1.125V18.75m12.75-9.75v-1.5a3 3 0 00-3-3h-1.5m-9 0H7.5a3 3 0 00-3 3v1.5m0 0a3 3 0 003 3h9a3 3 0 003-3m-15 0v3a6 6 0 006 6h3a6 6 0 006-6v-3" />
                      </svg>
                    </div>
                    {card.organizer && (
                      <span className="mt-2.5 text-[10px] sm:text-[11px] font-semibold text-zinc-400 truncate max-w-[170px]">
                        {card.organizer}
                      </span>
                    )}
                  </div>

                  {/* Bottom Info: Title, Caption & Action Link */}
                  <div className="relative z-10 border-t border-white/10 pt-3">
                    <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-white transition-colors duration-200 group-hover:text-[#FFB22C] leading-snug">
                      {card.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-normal">
                      {card.caption}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#FFB22C]">
                      <span>Detail Kompetisi</span>
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">↗</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Caption & Tombol di Bawah Info Lomba */}
        <div className="mx-auto max-w-4xl space-y-4 px-4 text-center sm:px-8">
          <p className="text-sm text-zinc-300 sm:text-base lg:text-lg">
            Raih prestasi dan pendanaan riset! Temukan berbagai peluang kompetisi ilmiah, olimpiade, dan inkubasi inovasi mahasiswa.
          </p>
          <div className="flex justify-center pt-1">
            <Link
              href="/competition"
              className="group inline-flex items-center gap-2 rounded-full border px-7 py-3 text-xs font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 sm:text-base"
              style={{
                borderColor: GOLD,
                color: GOLD,
                background: "rgba(27, 27, 31, 0.85)",
              }}
            >
              <span>Lihat Semua Lomba</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
