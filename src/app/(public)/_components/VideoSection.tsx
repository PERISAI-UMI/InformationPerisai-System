import Link from "next/link";
import { GOLD, Sparkle } from "./visuals";

interface VideoSectionProps {
  videoProfileEmbedUrl: string;
  videoProfileWatchUrl: string;
}

export function VideoSection({ videoProfileEmbedUrl, videoProfileWatchUrl }: VideoSectionProps) {
  return (
    <section className="relative py-10 sm:py-14">
      <Sparkle className="right-[2%] top-6" size={30} delay={0.6} float />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Judul khusus tampilan mobile (tampil pertama di atas video, rata tengah) */}
        <div className="mb-6 text-center md:hidden">
          <h2 className="text-4xl font-bold sm:text-5xl" style={{ color: GOLD }}>
            Video Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 lg:gap-14">
          {/* Video Player */}
          <div className="md:col-span-7">
            <div className="group relative aspect-video w-full overflow-hidden rounded-3xl border border-[#FFB22C]/40 bg-gradient-to-br from-[#292931] via-[#202026] to-[#161619] shadow-2xl transition duration-500 hover:border-[#FFB22C] hover:shadow-[0_0_35px_rgba(255,178,44,0.22)]">
              {/* Ambient Glows */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FFB22C]/15 blur-3xl" />
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-[#FFA000]/10 blur-3xl" />

              {/* Embedded YouTube Iframe Player */}
              <iframe
                src={`${videoProfileEmbedUrl}?rel=0&modestbranding=1`}
                title="Video Profil Resmi UKM PERISAI UMI"
                className="relative z-10 h-full w-full rounded-3xl border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Caption & Tombol (Judul desktop, deskripsi, tombol) */}
          <div className="space-y-5 text-center md:col-span-5 md:text-left">
            {/* Judul tampilan desktop */}
            <h2 className="hidden text-4xl font-bold sm:text-5xl lg:text-6xl md:block" style={{ color: GOLD }}>
              Video Profile
            </h2>
            <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-zinc-100 sm:text-base lg:text-lg md:mx-0 md:text-left">
              Bukan sekadar UKM, ini adalah rumah. Dari langkah pertama di kampus, diskusi tanpa
              henti, hingga prestasi yang mengukir nama. PERISAI UMI hadir sebagai ruang tumbuh,
              ruang belajar, dan ruang pulang bagi para inovator.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
              <Link
                href="/tentang"
                className="inline-block rounded-xl px-7 py-2.5 text-base font-bold text-[#1b1b1f] transition hover:brightness-110 shadow-md"
                style={{ background: GOLD }}
              >
                Pelajari Selengkapnya
              </Link>
              <a
                href={videoProfileWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 hover:border-[#FFB22C]/50"
              >
                <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                <span>Tonton di YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
