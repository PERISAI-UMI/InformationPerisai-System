import Link from "next/link";
import { GOLD, CARD, Sparkle } from "./visuals";

interface StatisticsSectionProps {
  alumniStat: string;
  pengurusCount: string | number;
}

export function StatisticsSection({ alumniStat, pengurusCount }: StatisticsSectionProps) {
  return (
    <section className="relative pb-10 pt-4 sm:pb-14">
      <Sparkle className="left-[3%] top-28 hidden md:block" size={28} delay={0.5} float />
      <Sparkle className="right-[3%] bottom-24 hidden md:block" size={26} delay={1.2} float />

      <div className="mx-auto max-w-[1440px] space-y-12 px-4 sm:px-8 lg:px-12 xl:px-16">
        <h2
          className="text-center text-3xl font-bold sm:text-5xl lg:text-6xl"
          style={{ color: GOLD }}
        >
          Lebih dari 150+ Inovator Telah Bergabung
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:gap-10">
          {/* Alumni */}
          <div
            className="flex min-h-[11rem] sm:min-h-[16rem] lg:min-h-[18rem] flex-col justify-between rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 lg:p-10 shadow-xl sm:shadow-2xl transition hover:-translate-y-1"
            style={{ background: CARD }}
          >
            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between gap-2">
              {/* Nomor: di mobile di tengah atas & lebih besar, di desktop di sebelah kanan */}
              <span
                className="order-1 sm:order-2 text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight text-center sm:text-right"
                style={{ color: GOLD }}
              >
                {alumniStat}
              </span>

              {/* Tulisan: di mobile di tengah tepat di bawah nomor & lebih besar jelas, di desktop di sebelah kiri */}
              <div
                className="order-2 sm:order-1 rounded-lg sm:rounded-xl px-2.5 py-1 sm:px-4 sm:py-2 text-center sm:text-left uppercase leading-tight text-[#1b1b1f]"
                style={{ background: GOLD }}
              >
                <span className="block text-sm sm:text-lg md:text-2xl font-extrabold tracking-wide">
                  Alumni
                </span>
                <span className="block text-[11px] sm:text-xs font-bold opacity-90 sm:hidden">
                  2014 - 2025
                </span>
                <span className="hidden sm:block text-xs md:text-sm font-semibold opacity-90">
                  UKM PERISAI UMI 2014 - 2025
                </span>
              </div>
            </div>

            <div className="mt-3 flex justify-center sm:justify-start">
              <Link
                href="/tentang/sejarah"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-200 transition hover:text-white sm:gap-2 sm:text-base"
              >
                <span
                  className="flex h-6 w-6 sm:h-9 sm:w-9 items-center justify-center rounded-full text-[10px] sm:text-base text-[#1b1b1f]"
                  style={{ background: GOLD }}
                >
                  ↗
                </span>
                <span className="hidden xs:inline sm:inline">Pelajari </span>Selengkapnya
              </Link>
            </div>
          </div>

          {/* Pengurus */}
          <div
            className="flex min-h-[11rem] sm:min-h-[16rem] lg:min-h-[18rem] flex-col justify-between rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 lg:p-10 text-[#1b1b1f] shadow-xl sm:shadow-2xl transition hover:-translate-y-1"
            style={{ background: GOLD }}
          >
            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between gap-2">
              {/* Nomor: di mobile di tengah atas & lebih besar, di desktop di sebelah kanan */}
              <span className="order-1 sm:order-2 text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight text-center sm:text-right">
                {pengurusCount}
              </span>

              {/* Tulisan: di mobile di tengah tepat di bawah nomor & lebih besar jelas, di desktop di sebelah kiri */}
              <div className="order-2 sm:order-1 rounded-lg sm:rounded-xl bg-[#1b1b1f] px-2.5 py-1 sm:px-4 sm:py-2 text-center sm:text-left uppercase leading-tight text-white">
                <span className="block text-sm sm:text-lg md:text-2xl font-extrabold tracking-wide" style={{ color: GOLD }}>
                  Pengurus
                </span>
                <span className="block text-[11px] sm:text-xs font-bold opacity-90 sm:hidden">
                  2026/2027
                </span>
                <span className="hidden sm:block text-xs md:text-sm font-semibold opacity-90">
                  UKM PERISAI UMI 2026/2027
                </span>
              </div>
            </div>

            <div className="mt-3 flex justify-center sm:justify-start">
              <Link
                href="/tentang/struktur"
                className="inline-flex items-center gap-1.5 text-xs font-medium transition hover:opacity-80 sm:gap-2 sm:text-base"
              >
                <span className="flex h-6 w-6 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#1b1b1f] text-[10px] sm:text-base text-white">
                  ↗
                </span>
                <span className="hidden xs:inline sm:inline">Pelajari </span>Selengkapnya
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
