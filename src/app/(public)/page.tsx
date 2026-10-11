import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/features/posts/queries.public";
import { getPublicWorkPrograms } from "@/features/work-programs/queries.public";
import { getPublicActiveMembers } from "@/features/members/queries.public";
import { getPublicStatistics } from "@/features/statistics/queries.public";
import { getPublicOpportunities } from "@/features/opportunities/queries.public";
import { getPublicSettings } from "@/features/settings/queries.public";
import { toYouTubeEmbedUrl, toYouTubeWatchUrl } from "@/lib/youtube";
import { formatDateIndonesian } from "@/lib/dates";

/* ------------------------------------------------------------------ */
/* Palet warna (diambil dari gambar desain)                            */
/* ------------------------------------------------------------------ */
const GOLD = "#FFB22C";
const GOLD_SOFT = "#FFC85A";
const BG = "#1b1b1f";
const CARD = "#2b2b31";


/* ------------------------------------------------------------------ */
/* Bintang 4 sudut + animasi                                           */
/* ------------------------------------------------------------------ */
function Sparkle({
  className = "",
  size = 24,
  delay = 0,
  float = false,
  color = GOLD,
}: {
  className?: string;
  size?: number;
  delay?: number;
  float?: boolean;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 ${className}`}
      style={{
        animation: `${float ? "pr-float 5s" : "pr-twinkle 3s"} ease-in-out ${delay}s infinite`,
        filter: `drop-shadow(0 0 6px ${color}99)`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 0C12.6 7 17 11.4 24 12C17 12.6 12.6 17 12 24C11.4 17 7 12.6 0 12C7 11.4 11.4 7 12 0Z" />
      </svg>
    </span>
  );
}


/* ------------------------------------------------------------------ */
/* Garis penghubung antar section                                      */
/* Koordinat path memakai viewBox 1000 x 200                           */
/* ------------------------------------------------------------------ */
function Connector({
  paths,
  children,
  className = "",
}: {
  paths: string[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative mx-auto hidden h-44 w-full max-w-[1440px] md:block lg:h-56 ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        fill="none"
      >
        {paths.map((d, i) => (
          <g key={i}>
            {/* garis dasar */}
            <path
              d={d}
              stroke={GOLD}
              strokeOpacity="0.55"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            {/* cahaya yang mengalir sepanjang garis */}
            <path
              d={d}
              pathLength={1}
              stroke={GOLD_SOFT}
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: "0.1 0.9",
                animation: `pr-flow 4.5s linear ${i * 1.2}s infinite`,
                filter: `drop-shadow(0 0 4px ${GOLD})`,
              }}
            />
          </g>
        ))}
      </svg>
      {children}
    </div>
  );
}

export default async function HomePage() {
  const [postsData, workPrograms, statistics, activeMembers, opportunitiesData, publicSettings] = await Promise.all([
    getPublishedPosts({ pageSize: 6 }),
    getPublicWorkPrograms(),
    getPublicStatistics(),
    getPublicActiveMembers(),
    getPublicOpportunities(),
    getPublicSettings(),
  ]);

  const videoProfileUrl = publicSettings.video_profile_url || "https://www.youtube.com/embed/JWg_p9PfnTg?si=87vTr-0un14kRxu6";
  const videoProfileEmbedUrl = toYouTubeEmbedUrl(videoProfileUrl);
  const videoProfileWatchUrl = toYouTubeWatchUrl(videoProfileUrl);

  const alumniStat =
    statistics.find((s) => s.label.toLowerCase().includes("alumni"))?.value || "100";
  const pengurusCount = activeMembers.length > 0 ? activeMembers.length : "58";

  const featuredProker = workPrograms[0] || {
    id: "proker-fgd",
    name: "Focus Group Discussion",
    slug: "focus-group-discussion",
    summary: "",
    status: "published",
    coverImageUrl: null,
  };

  const prokerDescription =
    (featuredProker as { description?: string }).description ||
    "Halo, Rekan-rekan Mahasiswa!\nAntara nilai akademik dan ketajaman logika, mana yang sebenarnya menentukan kualitas seorang mahasiswa? Apakah IPK tinggi sudah pasti menjamin kemampuan berpikir kritis?\n\nYuk, kita kupas tuntas dalam Focus Group Discussion (FGD) bersama narasumber ahli, dengan tema:\n\"IPK Tinggi vs Kemampuan Berpikir Kritis: Mana yang Lebih Merepresentasikan Mahasiswa Berkualitas?\"";

  const defaultNews = [
    {
      href: "/activity/perisai-humanity-konservasi-pesisir-mangrove",
      title: "PERISAI HUMANITY",
      caption: "Aksi Restorasi Sabuk Hijau & Konservasi Pesisir Maros - Makassar",
      tag: "Pengabdian",
      date: "Pengabdian",
    },
    {
      href: "/activity/delegasi-perisai-raih-medali-emas-lktin-2025",
      title: "PRESTASI EMAS PERISAI",
      caption: "Delegasi Peneliti Muda UMI Raih Medali Emas LKTIN Nasional 2025",
      tag: "Prestasi",
      date: "Juara 1 Nasional",
    },
    {
      href: "/activity/kolaborasi-riset-multidisiplin-biosensor-2025",
      title: "INOVASI BIOSENSOR UMI",
      caption: "Riset Multidisiplin Prototipe Sensor Diagnostik Terjangkau",
      tag: "Riset",
      date: "Riset FTI & FK",
    },
    {
      href: "/activity/bootcamp-penulisan-proposal-riset-kti-2025",
      title: "BOOTCAMP KARYA TULIS",
      caption: "Pelatihan Penulisan Proposal & Metodologi KTI Saintifik 2025",
      tag: "Pelatihan",
      date: "Klinik KTI",
    },
    {
      href: "/activity/kunjungan-studi-benchmarking-brida-sulsel",
      title: "BENCHMARKING BRIDA",
      caption: "Kunjungan Studi Saintifik & Hilirisasi Riset Daerah Sulsel",
      tag: "Kolaborasi",
      date: "Studi Ekskursi",
    },
  ];

  const newsBaseList = [
    ...postsData.items.map((p) => ({
      href: `/activity/${p.slug}`,
      title: p.title,
      caption: p.excerpt || (p.publishedAt ? formatDateIndonesian(p.publishedAt) : "Berita Terbaru"),
      tag: p.category || "Berita",
      date: p.publishedAt ? formatDateIndonesian(p.publishedAt) : "Terbaru",
    })),
    ...defaultNews,
  ];

  // Replikasi 4x untuk infinite marquee mulus tanpa jeda
  const newsMarqueeItems = [
    ...newsBaseList,
    ...newsBaseList,
    ...newsBaseList,
    ...newsBaseList,
  ];

  const defaultOpportunities = [
    {
      href: "/competition/pkm-8-bidang-kemendikbudristek-2025",
      title: "PKM 8 BIDANG 2025",
      caption: "Pendanaan Riset & Inovasi Belmawa Kemendikbudristek",
      tag: "KEMENDIKBUD",
      date: "Sisa 24 Hari",
      organizer: "Ditjen Diktiristek",
    },
    {
      href: "/competition/pimnas-38-pekan-ilmiah-nasional-2025",
      title: "PIMNAS 38",
      caption: "Pekan Ilmiah Mahasiswa Nasional Tingkat Perguruan Tinggi",
      tag: "NASIONAL",
      date: "Sisa 45 Hari",
      organizer: "Puspresnas Kemdikbud",
    },
    {
      href: "/competition/perisai-national-research-fair-lktin-2025",
      title: "PERISAI RESEARCH FAIR",
      caption: "Lomba Karya Tulis Ilmiah Nasional & Expo Inovasi UMI 2025",
      tag: "KARYA TULIS",
      date: "Sisa 18 Hari",
      organizer: "UKM PERISAI UMI",
    },
    {
      href: "/competition/innovillage-2025-social-project-telkom",
      title: "INNOVILLAGE 2025",
      caption: "Kompetisi Social Project & Digital Village Solution Telkom",
      tag: "INOVASI",
      date: "Sisa 12 Hari",
      organizer: "Telkom Indonesia",
    },
    {
      href: "/competition/djarum-beasiswa-plus-2025",
      title: "DJARUM BEASISWA PLUS",
      caption: "Beasiswa Kepemimpinan & Academic Development Program",
      tag: "BEASISWA",
      date: "Sisa 8 Hari",
      organizer: "Djarum Foundation",
    },
  ];

  const opportunityBaseList = [
    ...opportunitiesData.items.map((op) => ({
      href: `/competition/${op.slug}`,
      title: op.title,
      caption: op.description?.replace(/<[^>]*>/g, "") || op.organizer || "Kompetisi Mahasiswa",
      tag: op.category || "LOMBA",
      date: op.deadlineAt ? `Tenggat: ${formatDateIndonesian(op.deadlineAt)}` : "Terbuka",
      organizer: op.organizer || "PERISAI UMI",
    })),
    ...defaultOpportunities,
  ];

  const opportunityMarqueeItems = [
    ...opportunityBaseList,
    ...opportunityBaseList,
    ...opportunityBaseList,
    ...opportunityBaseList,
  ];

  return (
    <div
      className="relative overflow-hidden text-white selection:bg-[#FFB22C] selection:text-[#1b1b1f]"
      style={{ background: BG }}
    >
      {/* Keyframes animasi */}
      <style>{`
        @keyframes pr-twinkle {
          0%, 100% { opacity: .45; transform: scale(.75) rotate(0deg); }
          50%      { opacity: 1;   transform: scale(1.25) rotate(25deg); }
        }
        @keyframes pr-float {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: .9; }
          50%      { transform: translateY(-14px) rotate(20deg) scale(1.15); opacity: 1; }
        }
        @keyframes pr-flow {
          from { stroke-dashoffset: 0.1; }
          to   { stroke-dashoffset: -0.9; }
        }
        @keyframes pr-glow {
          0%, 100% { opacity: .55; }
          50%      { opacity: .9; }
        }
        @keyframes pr-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pr-shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(250%); }
        }
        .pr-marquee-track {
          display: flex;
          width: max-content;
          animation: pr-marquee 70s linear infinite;
          will-change: transform;
        }
        .pr-marquee-track:hover {
          animation-play-state: paused;
        }
        .pr-marquee-track-alt {
          display: flex;
          width: max-content;
          animation: pr-marquee 80s linear infinite;
          will-change: transform;
        }
        .pr-marquee-track-alt:hover {
          animation-play-state: paused;
        }
        /* Sembunyikan scrollbar di browser */
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="pr-"], path[style*="pr-"], .pr-marquee-track, .pr-marquee-track-alt {
            animation: none !important;
          }
        }
      `}</style>

      {/* Glow oranye di tepi (seperti pada desain) */}
      <div
        className="pointer-events-none absolute -left-24 top-24 h-72 w-48 rounded-full blur-3xl"
        style={{ background: `${GOLD}55`, animation: "pr-glow 6s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute -right-24 top-[58rem] hidden h-72 w-48 rounded-full blur-3xl md:block"
        style={{ background: `${GOLD}44`, animation: "pr-glow 7s ease-in-out 1s infinite" }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-[130rem] hidden h-72 w-48 rounded-full blur-3xl md:block"
        style={{ background: `${GOLD}44`, animation: "pr-glow 7s ease-in-out 2s infinite" }}
      />

      {/* ======================================================== */}
      {/* 1. HERO                                                  */}
      {/* ======================================================== */}
      <section className="relative pb-6 pt-10 sm:pt-16">
        <Sparkle className="right-[42%] top-12 hidden lg:block" size={34} delay={0.4} float />
        <Sparkle className="right-[3%] top-8" size={30} delay={1.1} float />
        <Sparkle className="right-[8%] top-[24rem] hidden sm:block" size={20} delay={0.7} />

        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 xl:gap-14">
            {/* Kiri: teks (rata tengah di mobile, rata kiri di desktop) */}
            <div className="space-y-3 text-center lg:col-span-7 lg:text-left">
              <p className="text-base font-bold uppercase tracking-wider sm:text-lg lg:text-xl">
                Unit Kegiatan Mahasiswa
              </p>
              <h1
                className="text-4xl font-bold uppercase leading-[1.08] sm:text-6xl lg:text-7xl xl:text-[4.75rem]"
                style={{ color: GOLD }}
              >
                Pusat Pengembangan
                <br />
                Riset Mahasiswa
              </h1>
              <h2 className="text-lg font-bold uppercase sm:text-2xl lg:text-3xl">
                Universitas Muslim Indonesia
              </h2>
              <p className="mx-auto max-w-2xl pt-6 text-center text-sm leading-relaxed text-zinc-200 sm:pt-8 sm:text-lg lg:text-xl lg:mx-0 lg:text-left">
                UKM Perisai (Pusat Pengembangan Riset Mahasiswa) adalah wadah mahasiswa untuk
                berinovasi dan berkolaborasi dalam berbagai bidang.
              </p>
              <div className="flex justify-center pt-4 lg:justify-start">
                <Link
                  href="/kontak"
                  className="inline-block rounded-xl px-8 py-3 text-base sm:text-lg font-bold text-[#1b1b1f] shadow-[0_4px_0_#b57a10] transition hover:-translate-y-0.5 hover:brightness-110"
                  style={{ background: GOLD }}
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Kanan: maskot + glow (disembunyikan di mobile, hanya muncul di desktop) */}
            <div className="relative hidden justify-center lg:col-span-5 lg:flex">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[30rem] sm:w-[30rem] lg:h-[36rem] lg:w-[36rem]"
                style={{ background: `${GOLD}66`, animation: "pr-glow 5s ease-in-out infinite" }}
              />
              <Image
                src="/maskot.png"
                alt="Fungsionaris UKM PERISAI UMI"
                width={550}
                height={720}
                priority
                className="relative h-80 w-auto object-contain drop-shadow-2xl sm:h-[460px] lg:h-[540px] xl:h-[600px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Garis: Hero -> Video */}
      <Connector
        paths={["M140 0 C 140 150, 260 190, 420 150 C 560 115, 640 120, 700 200"]}
      >
        <Sparkle className="left-[40%] top-[62%]" size={34} delay={0.3} float />
        <Sparkle className="left-[57%] top-[40%]" size={42} delay={1} />
      </Connector>

      {/* ======================================================== */}
      {/* 2. VIDEO PROFILE                                         */}
      {/* ======================================================== */}
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
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
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

      {/* Garis: Video -> Program Kerja */}
      <Connector paths={["M640 0 C 640 120, 500 80, 500 200"]} />

      {/* ======================================================== */}
      {/* 3. PROGRAM KERJA                                         */}
      {/* ======================================================== */}
      <section className="relative pb-10 pt-4 sm:pb-14">
        <Sparkle className="left-[6%] top-24 hidden md:block" size={22} delay={0.9} />
        <div className="mx-auto max-w-[1440px] space-y-12 px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Header seksi: judul di mobile & desktop; subjudul header di desktop */}
          <div className="mx-auto max-w-4xl space-y-3 text-center">
            <h2 className="text-4xl font-bold sm:text-5xl lg:text-6xl" style={{ color: GOLD }}>
              Program Kerja Kami
            </h2>
            <p className="hidden text-base leading-relaxed text-zinc-100 sm:text-lg lg:text-xl lg:block">
              UKM Perisai (Pusat Pengembangan Riset Mahasiswa) memiliki beberapa program kerja
              sebagai penunjang mahasiswa inovatif
            </p>
          </div>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Kiri: poster bertumpuk, Pelajari Selengkapnya, dan caption header pada mobile */}
            <div className="flex flex-col items-center justify-center lg:col-span-5">
              <div className="relative pl-12 sm:pl-16">
                {/* Kontainer stack kartu: tinggi terkunci sama persis dengan poster */}
                <div className="relative w-64 sm:w-76 lg:w-80 xl:w-88">
                  {/* Kartu-kartu belakang */}
                  {[40, 26, 13].map((offset, i) => (
                    <div
                      key={offset}
                      aria-hidden
                      className="absolute inset-y-0 w-full rounded-2xl border-2"
                      style={{
                        left: `-${offset}px`,
                        borderColor: `${GOLD}77`,
                        background: "#202026",
                        opacity: 0.5 + i * 0.2,
                      }}
                    />
                  ))}

                  {/* Poster utama: Default Obsidian Gold Card jika tidak ada cover khusus */}
                  {featuredProker.coverImageUrl && !featuredProker.coverImageUrl.includes("og-default") ? (
                    <div
                      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-[3px] shadow-2xl"
                      style={{ borderColor: GOLD }}
                    >
                      <Image
                        src={featuredProker.coverImageUrl}
                        alt={featuredProker.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-[3px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between text-center bg-gradient-to-br from-[#292931] via-[#202026] to-[#161619]"
                      style={{ borderColor: GOLD }}
                    >
                      {/* Ambient Glows */}
                      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#FFB22C]/15 blur-2xl" />
                      <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-[#FFA000]/10 blur-2xl" />

                      {/* Header Tag */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span
                          className="rounded-full px-3 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest backdrop-blur-md"
                          style={{
                            background: "rgba(27, 27, 31, 0.85)",
                            color: GOLD,
                            border: `1px solid ${GOLD}66`,
                          }}
                        >
                          ✦ PROGRAM UNGGULAN ✦
                        </span>
                        <span className="text-xs text-[#FFB22C] font-bold">2026</span>
                      </div>

                      {/* Center Emblem: Futuristic Gold Shield Box & Title */}
                      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2">
                        <div className="relative mb-3 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl border border-[#FFB22C]/40 bg-[#FFB22C]/10 shadow-[0_0_25px_rgba(255,178,44,0.25)] backdrop-blur-md transition-transform duration-300 hover:scale-105">
                          <Image
                            src="/logoperisaii.png"
                            alt="Logo PERISAI UMI"
                            width={64}
                            height={64}
                            className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow"
                          />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FFB22C]">
                          UKM PERISAI UMI
                        </span>
                        <h4 className="mt-1 text-lg sm:text-xl font-black text-white line-clamp-2 leading-tight">
                          {featuredProker.name}
                        </h4>
                      </div>

                      {/* Bottom Footer Info */}
                      <div className="relative z-10 border-t border-white/10 pt-3">
                        <p className="text-[10px] sm:text-xs text-zinc-300 font-medium">
                          Pusat Pengembangan Riset Mahasiswa
                        </p>
                        <div className="mt-1 flex items-center justify-center gap-2 text-[10px] font-bold text-[#FFB22C]">
                          <span>Inovasi</span>
                          <span>•</span>
                          <span>Penelitian</span>
                          <span>•</span>
                          <span>Prestasi</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tombol panah di sisi kiri poster utama */}
                  <button
                    type="button"
                    aria-label="Program sebelumnya"
                    className="absolute -left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#1b1b1f] text-xl font-bold shadow-lg ring-2 ring-white transition hover:scale-110"
                    style={{ color: GOLD }}
                  >
                    ←
                  </button>
                </div>

                {/* Tautan Pelajari Selengkapnya PAS persis di bawah gambar poster */}
                <div className="mt-5 w-64 text-center sm:w-76 lg:w-80 xl:w-88">
                  <Link
                    href="/tentang/sumber-daya#proker"
                    className="inline-flex items-center gap-2 text-base font-bold underline underline-offset-4 transition hover:brightness-125"
                    style={{ color: GOLD }}
                  >
                    Pelajari Selengkapnya <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Caption header pada tampilan mobile: tampil tepat setelah gambar */}
              <p className="mx-auto max-w-sm pt-6 text-center text-sm leading-relaxed text-zinc-100 lg:hidden">
                UKM Perisai (Pusat Pengembangan Riset Mahasiswa) memiliki beberapa program kerja
                sebagai penunjang mahasiswa inovatif
              </p>
            </div>

            {/* Kanan: kotak penjelasan program (dihilangkan di mobile, tetap ada di desktop) */}
            <div
              className="relative hidden rounded-3xl border-[3px] p-8 sm:p-10 lg:col-span-7 lg:block lg:p-12 shadow-2xl"
              style={{ borderColor: GOLD }}
            >
              <h3 className="text-3xl font-bold sm:text-4xl lg:text-5xl" style={{ color: GOLD }}>
                {featuredProker.name}
              </h3>
              <p className="mt-3 text-xl sm:text-2xl font-semibold">
                Salam Inovator
              </p>
              <p className="mt-6 whitespace-pre-line text-base sm:text-lg leading-relaxed text-zinc-100">
                {prokerDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Garis: Program -> Statistik */}
      <Connector paths={["M200 0 C 200 130, 500 70, 500 200"]} />

      {/* ======================================================== */}
      {/* 4. STATISTIK                                             */}
      {/* ======================================================== */}
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

      {/* Garis: Statistik -> News (dua garis bertemu di judul) */}
      <Connector
        paths={[
          "M200 0 C 200 120, 500 70, 500 200",
          "M800 0 C 800 120, 500 70, 500 200",
        ]}
      >
        <Sparkle className="left-[50%] top-[45%] -translate-x-1/2" size={30} delay={0.4} />
      </Connector>

      {/* ======================================================== */}
      {/* 5. PERISAI NEWS                                          */}
      {/* ======================================================== */}
      <section className="relative pb-16 pt-4">
        <Sparkle className="left-[8%] top-10 hidden md:block" size={22} delay={0.3} />
        <Sparkle className="right-[8%] top-24 hidden md:block" size={26} delay={1.4} float />

        <div className="space-y-8">
          <h2
            className="text-center text-4xl font-bold uppercase sm:text-5xl lg:text-6xl"
            style={{ color: GOLD }}
          >
            Perisai News
          </h2>

          {/* Marquee Ticker Loop ke Kiri dengan Card Ringkas */}
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

            <div className="pr-marquee-track">
              {newsMarqueeItems.map((card, idx) => (
                <div key={`news-${idx}`} className="shrink-0 pr-4 sm:pr-6 lg:pr-8">
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>

                    {/* Top Row: Category Tag & Sparkle */}
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
                      <span className="text-xs text-[#FFB22C] opacity-80 group-hover:scale-125 transition-transform">
                        ✦
                      </span>
                    </div>

                    {/* Center Emblem: Minimalist Obsidian Gold Vector Icon Box */}
                    <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2">
                      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl border border-[#FFB22C]/30 bg-[#FFB22C]/10 text-[#FFB22C] shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-[#FFB22C]/60 group-hover:bg-[#FFB22C]/20 group-hover:shadow-[0_0_20px_rgba(255,178,44,0.25)]">
                        <svg className="h-7 w-7 sm:h-9 sm:w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      {card.date && (
                        <span className="mt-2.5 text-[10px] sm:text-[11px] font-semibold text-zinc-400">
                          {card.date}
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
                        <span>Eksplorasi Warta</span>
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Caption & Tombol di Bawah Perisai News */}
          <div className="mx-auto max-w-4xl space-y-4 px-4 text-center sm:px-8">
            <p className="text-sm text-zinc-300 sm:text-base lg:text-lg">
              Ikuti berita terbaru, liputan kegiatan, artikel inovasi, dan kabar inspiratif dari civitas UKM PERISAI UMI.
            </p>
            <div className="flex justify-center pt-1">
              <Link
                href="/activity"
                className="group inline-flex items-center gap-2 rounded-full border px-7 py-3 text-xs font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 sm:text-base"
                style={{
                  borderColor: GOLD,
                  color: GOLD,
                  background: "rgba(27, 27, 31, 0.85)",
                }}
              >
                <span>Pelajari Selengkapnya</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Garis: News -> Info Lomba */}
      <Connector
        paths={[
          "M300 0 C 300 100, 500 100, 500 200",
          "M700 0 C 700 100, 500 100, 500 200",
        ]}
      >
        <Sparkle className="left-[50%] top-[45%] -translate-x-1/2" size={30} delay={0.5} />
      </Connector>

      {/* ======================================================== */}
      {/* 6. INFO LOMBA & KOMPETISI                                */}
      {/* ======================================================== */}
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

      {/* Garis: Info Lomba -> Perisai Store */}
      <Connector
        paths={[
          "M300 0 C 300 100, 500 100, 500 200",
          "M700 0 C 700 100, 500 100, 500 200",
        ]}
      >
        <Sparkle className="left-[50%] top-[45%] -translate-x-1/2" size={30} delay={0.6} />
      </Connector>

      {/* ======================================================== */}
      {/* 7. PERISAI STORE                                         */}
      {/* ======================================================== */}
      <section className="relative pb-24 pt-4">
        <Sparkle className="left-[5%] top-12 hidden md:block" size={26} delay={0.5} float />
        <Sparkle className="right-[5%] top-20 hidden md:block" size={22} delay={1.2} />

        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-2xl relative overflow-hidden rounded-3xl border border-[#FFB22C]/40 bg-gradient-to-b from-[#26262e] via-[#1f1f25] to-[#161619] p-8 sm:p-10 text-center shadow-2xl">
            {/* Ambient Radiant Lights */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FFB22C]/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#FFA000]/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center space-y-4">
              {/* Badge Atas */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB22C]/40 bg-[#FFB22C]/10 px-4 py-1 text-xs font-bold text-[#FFB22C] shadow-[0_0_15px_rgba(255,178,44,0.15)]">
                <span>✦</span>
                <span className="tracking-widest uppercase">OFFICIAL STORE & MERCHANDISE</span>
                <span>✦</span>
              </div>

              {/* Judul Emas */}
              <h2
                className="text-3xl font-extrabold uppercase sm:text-4xl lg:text-5xl"
                style={{ color: GOLD }}
              >
                Perisai Store
              </h2>

              {/* Tombol CTA Elegan */}
              <div className="pt-2">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20PERISAI%20Store,%20saya%20tertarik%20dengan%20katalog%20merchandise%20resmi!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center rounded-full px-8 py-3 text-xs sm:text-sm font-bold text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/25 transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #FFC85A 0%, #FFB22C 50%, #FFA000 100%)",
                  }}
                >
                  <span>Kunjungi PERISAI Store</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}