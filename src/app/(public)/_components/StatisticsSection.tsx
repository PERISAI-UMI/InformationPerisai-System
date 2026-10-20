import Link from "next/link";
import { Sparkle } from "./visuals";

interface StatisticsSectionProps {
  alumniStat: string;
  pengurusCount: string | number;
}

export function StatisticsSection({ alumniStat, pengurusCount }: StatisticsSectionProps) {
  // Pastikan alumni memiliki tanda '+' jika angka
  const formattedAlumni =
    typeof alumniStat === "string" && !alumniStat.includes("+") && !isNaN(Number(alumniStat))
      ? `${alumniStat}+`
      : alumniStat || "300+";

  return (
    <section className="relative pb-12 pt-6 sm:pb-16 sm:pt-10">
      <Sparkle className="left-[3%] top-28 hidden md:block" size={28} delay={0.5} float />
      <Sparkle className="right-[3%] bottom-24 hidden md:block" size={26} delay={1.2} float />

      <div className="mx-auto max-w-[1440px] space-y-10 sm:space-y-12 px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB22C]/40 bg-[#FFB22C]/10 px-4 py-1 text-xs font-bold text-[#FFB22C] shadow-[0_0_15px_rgba(255,178,44,0.15)] backdrop-blur-md">
            <span>✦</span>
            <span className="tracking-widest uppercase">EKOSISTEM INOVATOR & RISET</span>
            <span>✦</span>
          </div>

          <h2 className="text-3xl font-black uppercase sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Lebih Dari{" "}
            <span className="bg-gradient-to-r from-[#FFB22C] via-[#FFD700] to-[#FFA000] bg-clip-text text-transparent">
              300+ Inovator
            </span>{" "}
            Telah Bergabung
          </h2>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-zinc-300 font-normal leading-relaxed">
            Membangun ekosistem riset saintifik, kepenulisan ilmiah, dan kepemimpinan berkarakter di Universitas Muslim Indonesia sejak 2014.
          </p>
        </div>

        {/* 2 Symmetrical Obsidian Gold Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Card 1: Alumni */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#292931] via-[#202026] to-[#161619] p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-1.5 hover:border-[#FFB22C] hover:shadow-[0_0_40px_rgba(255,178,44,0.22)]">
            {/* Ambient Corner Glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFB22C]/10 blur-3xl group-hover:bg-[#FFB22C]/20 transition-all duration-500" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-[#FFA000]/5 blur-2xl" />

            {/* Faint Watermark SVG (Graduation Cap) */}
            <div className="pointer-events-none absolute right-2 bottom-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none text-zinc-100">
              <svg className="h-44 w-44 sm:h-56 sm:w-56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14v7" />
              </svg>
            </div>

            {/* Top Row: Tag & Era */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB22C]/40 bg-[#1b1b1f]/85 px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FFB22C] shadow-md backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#FFB22C]" />
                ALUMNI
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-400">
                2014 – Sekarang
              </span>
            </div>

            {/* Middle: Number & Description */}
            <div className="relative z-10 my-6 sm:my-8 space-y-2">
              <div className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none bg-gradient-to-r from-[#FFB22C] via-[#FFD700] to-[#FFA000] bg-clip-text text-transparent">
                {formattedAlumni}
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                Alumni &amp; Demisioner
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal max-w-md">
                Jejaring periset muda, akademisi, inovator industri, dan demisioner berprestasi UKM PERISAI UMI.
              </p>
            </div>

            {/* Bottom: Action Link */}
            <div className="relative z-10 border-t border-white/10 pt-4">
              <Link
                href="/tentang/sejarah"
                className="group/btn inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFB22C] hover:text-[#FFD700] transition"
              >
                <span>Pelajari Jejak Sejarah</span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FFB22C]/10 border border-[#FFB22C]/30 text-[11px] transition-transform duration-200 group-hover/btn:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Card 2: Pengurus */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#292931] via-[#202026] to-[#161619] p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-1.5 hover:border-[#FFB22C] hover:shadow-[0_0_40px_rgba(255,178,44,0.22)]">
            {/* Ambient Corner Glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFB22C]/10 blur-3xl group-hover:bg-[#FFB22C]/20 transition-all duration-500" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-[#FFA000]/5 blur-2xl" />

            {/* Faint Watermark SVG (Users) */}
            <div className="pointer-events-none absolute right-2 bottom-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none text-zinc-100">
              <svg className="h-44 w-44 sm:h-56 sm:w-56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>

            {/* Top Row: Tag & Periode */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 shadow-md backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                PENGURUS AKTIF
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-400">
                Periode 2026/2027
              </span>
            </div>

            {/* Middle: Number & Description */}
            <div className="relative z-10 my-6 sm:my-8 space-y-2">
              <div className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none bg-gradient-to-r from-[#FFB22C] via-[#FFD700] to-[#FFA000] bg-clip-text text-transparent">
                {pengurusCount}
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                Fungsionaris Kabinet
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal max-w-md">
                Penggerak utama seluruh divisi riset saintifik, kepenulisan, kaderisasi, dan kolaborasi kabinet berjalan.
              </p>
            </div>

            {/* Bottom: Action Link */}
            <div className="relative z-10 border-t border-white/10 pt-4">
              <Link
                href="/tentang/struktur"
                className="group/btn inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFB22C] hover:text-[#FFD700] transition"
              >
                <span>Lihat Struktur Organisasi</span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FFB22C]/10 border border-[#FFB22C]/30 text-[11px] transition-transform duration-200 group-hover/btn:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

