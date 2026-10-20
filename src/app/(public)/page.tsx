import { getPublishedPosts } from "@/features/posts/queries.public";
import { getPublicWorkPrograms } from "@/features/work-programs/queries.public";
import { getPublicActiveMembers } from "@/features/members/queries.public";
import { getPublicStatistics } from "@/features/statistics/queries.public";
import { getPublicOpportunities } from "@/features/opportunities/queries.public";
import { getPublicSettings } from "@/features/settings/queries.public";
import { toYouTubeEmbedUrl, toYouTubeWatchUrl } from "@/lib/youtube";
import { formatDateIndonesian } from "@/lib/dates";

import { BG, GOLD, Connector, Sparkle } from "./_components/visuals";
import { HeroSection } from "./_components/HeroSection";
import { VideoSection } from "./_components/VideoSection";
import { FocusProgramSection } from "./_components/FocusProgramSection";
import { StatisticsSection } from "./_components/StatisticsSection";
import { NewsMarqueeSection, MarqueeItem } from "./_components/NewsMarqueeSection";
import { OpportunitiesMarqueeSection, OpportunityMarqueeItem } from "./_components/OpportunitiesMarqueeSection";
import { PerisaiStoreSection } from "./_components/PerisaiStoreSection";

export const revalidate = 60;

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
    statistics.find((s) => s.label.toLowerCase().includes("alumni"))?.value || "300+";
  const pengurusCount = activeMembers.length > 0 ? activeMembers.length : "40";

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

  const defaultNews: MarqueeItem[] = [
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

  const newsBaseList: MarqueeItem[] = [
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

  const defaultOpportunities: OpportunityMarqueeItem[] = [
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

  const opportunityBaseList: OpportunityMarqueeItem[] = [
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

      {/* Ambient glow oranye */}
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

      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* Garis: Hero -> Video */}
      <Connector
        paths={["M140 0 C 140 150, 260 190, 420 150 C 560 115, 640 120, 700 200"]}
      >
        <Sparkle className="left-[40%] top-[62%]" size={34} delay={0.3} float />
        <Sparkle className="left-[57%] top-[40%]" size={42} delay={1} />
      </Connector>

      {/* 2. VIDEO PROFILE */}
      <VideoSection
        videoProfileEmbedUrl={videoProfileEmbedUrl}
        videoProfileWatchUrl={videoProfileWatchUrl}
      />

      {/* Garis: Video -> Program Kerja */}
      <Connector paths={["M640 0 C 640 120, 500 80, 500 200"]} />

      {/* 3. PROGRAM KERJA UNGGULAN */}
      <FocusProgramSection
        featuredProker={featuredProker}
        prokerDescription={prokerDescription}
      />

      {/* Garis: Program -> Statistik */}
      <Connector paths={["M200 0 C 200 130, 500 70, 500 200"]} />

      {/* 4. STATISTIK INOVATOR */}
      <StatisticsSection
        alumniStat={alumniStat}
        pengurusCount={pengurusCount}
      />

      {/* Garis: Statistik -> News */}
      <Connector
        paths={[
          "M200 0 C 200 120, 500 70, 500 200",
          "M800 0 C 800 120, 500 70, 500 200",
        ]}
      >
        <Sparkle className="left-[50%] top-[45%] -translate-x-1/2" size={30} delay={0.4} />
      </Connector>

      {/* 5. PERISAI NEWS */}
      <NewsMarqueeSection newsMarqueeItems={newsMarqueeItems} />

      {/* Garis: News -> Info Lomba */}
      <Connector
        paths={[
          "M300 0 C 300 100, 500 100, 500 200",
          "M700 0 C 700 100, 500 100, 500 200",
        ]}
      >
        <Sparkle className="left-[50%] top-[45%] -translate-x-1/2" size={30} delay={0.5} />
      </Connector>

      {/* 6. INFO LOMBA & KOMPETISI */}
      <OpportunitiesMarqueeSection opportunityMarqueeItems={opportunityMarqueeItems} />

      {/* Garis: Info Lomba -> Perisai Store */}
      <Connector
        paths={[
          "M300 0 C 300 100, 500 100, 500 200",
          "M700 0 C 700 100, 500 100, 500 200",
        ]}
      >
        <Sparkle className="left-[50%] top-[45%] -translate-x-1/2" size={30} delay={0.6} />
      </Connector>

      {/* 7. PERISAI STORE */}
      <PerisaiStoreSection />
    </div>
  );
}