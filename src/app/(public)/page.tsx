import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/features/posts/queries.public";
import { getPublicWorkPrograms } from "@/features/work-programs/queries.public";
import { getPublicActiveMembers } from "@/features/members/queries.public";
import { getPublicStatistics } from "@/features/statistics/queries.public";
import { getPublicOpportunities } from "@/features/opportunities/queries.public";
import { formatDateIndonesian } from "@/lib/dates";

/* ------------------------------------------------------------------ */
/* Palet warna (diambil dari gambar desain)                            */
/* ------------------------------------------------------------------ */
const GOLD = "#FFB22C";
const GOLD_SOFT = "#FFC85A";
const BG = "#1b1b1f";
const CARD = "#2b2b31";

/* Ganti path gambar ini dengan foto asli kegiatan kamu */
const IMG_VIDEO = "/og-default.jpg";
const IMG_HUMANITY = "/og-default.jpg";
const IMG_PRESTASI = "/og-default.jpg";

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
  const [postsData, workPrograms, statistics, activeMembers, opportunities] = await Promise.all([
    getPublishedPosts({ pageSize: 6 }),
    getPublicWorkPrograms(),
    getPublicStatistics(),
    getPublicActiveMembers(),
    getPublicOpportunities(),
  ]);

  const alumniStat =
    statistics.find((s) => s.label.toLowerCase().includes("alumni"))?.value || "100";
  const pengurusCount = activeMembers.length > 0 ? activeMembers.length : "58";

  const featuredProker = workPrograms[0] || {
    id: "proker-fgd",
    name: "Focus Group Discussion",
    slug: "focus-group-discussion",
    summary: "",
    status: "published",
    coverImageUrl: "/og-default.jpg",
  };

  const prokerDescription =
    (featuredProker as { description?: string }).description ||
    "Halo, Rekan-rekan Mahasiswa!\nAntara nilai akademik dan ketajaman logika, mana yang sebenarnya menentukan kualitas seorang mahasiswa? Apakah IPK tinggi sudah pasti menjamin kemampuan berpikir kritis?\n\nYuk, kita kupas tuntas dalam Focus Group Discussion (FGD) bersama narasumber ahli, dengan tema:\n\"IPK Tinggi vs Kemampuan Berpikir Kritis: Mana yang Lebih Merepresentasikan Mahasiswa Berkualitas?\"";

  const defaultNews = [
    {
      href: "/activity",
      img: IMG_HUMANITY,
      title: "PERISAI HUMANITY",
      caption: "1 Mangrove, Seribu Manfaat - Konservasi Pesisir",
      tag: "Kegiatan",
    },
    {
      href: "/competition",
      img: IMG_PRESTASI,
      title: "PRESTASI PERISAI",
      caption: "Inovator Berhasil Meraih Medali Emas & Penghargaan",
      tag: "Prestasi",
    },
    {
      href: "/activity",
      img: "/og-default.jpg",
      title: "INOVASI RISET UMI",
      caption: "Pengembangan Prototipe Teknologi Ramah Lingkungan",
      tag: "Penelitian",
    },
    {
      href: "/activity",
      img: "/og-default.jpg",
      title: "WORKSHOP KARYA TULIS",
      caption: "Pelatihan Penulisan Proposal & Publikasi Ilmiah",
      tag: "Edukasi",
    },
    {
      href: "/activity",
      img: "/og-default.jpg",
      title: "STUDI KOLABORASI",
      caption: "Kunjungan Studi Riset ke Laboratorium Terpadu",
      tag: "Kolaborasi",
    },
  ];

  const newsBaseList = [
    ...postsData.items.map((p) => ({
      href: `/activity/${p.slug}`,
      img: p.coverImageUrl || "/og-default.jpg",
      title: p.title,
      caption: p.excerpt || (p.publishedAt ? formatDateIndonesian(p.publishedAt) : "Berita Terbaru"),
      tag: "Berita",
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
      href: "/competition",
      img: "/og-default.jpg",
      title: "PKM 8 BIDANG 2025",
      caption: "Pendanaan Riset & Inovasi Belmawa Kemendikbudristek",
      tag: "KEMENDIKBUD",
    },
    {
      href: "/competition",
      img: "/og-default.jpg",
      title: "PIMNAS 38",
      caption: "Pekan Ilmiah Mahasiswa Nasional Tingkat Perguruan Tinggi",
      tag: "NASIONAL",
    },
    {
      href: "/competition",
      img: "/og-default.jpg",
      title: "LKTIN RESEARCH FESTIVAL",
      caption: "Lomba Karya Tulis Ilmiah Nasional & Expo Inovasi",
      tag: "KARYA TULIS",
    },
    {
      href: "/competition",
      img: "/og-default.jpg",
      title: "INNOVILLAGE 2025",
      caption: "Kompetisi Social Project & Digital Village Solution",
      tag: "INOVASI",
    },
    {
      href: "/competition",
      img: "/og-default.jpg",
      title: "KIBM WIRAUSAHA",
      caption: "Inkubasi & Pendanaan Ide Bisnis Mahasiswa Berprestasi",
      tag: "BISNIS",
    },
  ];

  const opportunityBaseList = [
    ...opportunities.map((op) => ({
      href: `/competition/${op.slug}`,
      img: op.coverImageUrl || "/og-default.jpg",
      title: op.title,
      caption: op.description || op.organizer || "Kompetisi Mahasiswa",
      tag: op.category || "LOMBA",
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
        .pr-marquee-track {
          display: flex;
          width: max-content;
          animation: pr-marquee 28s linear infinite;
          will-change: transform;
        }
        .pr-marquee-track:hover {
          animation-play-state: paused;
        }
        .pr-marquee-track-alt {
          display: flex;
          width: max-content;
          animation: pr-marquee 32s linear infinite;
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
              <div className="group relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
                <Image
                  src={IMG_VIDEO}
                  alt="Video Profile PERISAI UMI"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <a
                    href="https://youtube.com/@perisaiumi"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Tonton Video Profile di YouTube"
                    className="flex h-16 w-24 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl transition hover:scale-110 sm:h-20 sm:w-28"
                  >
                    <svg className="h-9 w-9 sm:h-11 sm:w-11" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </a>
                </div>
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
              <div className="flex justify-center md:justify-start pt-1">
                <Link
                  href="/tentang"
                  className="inline-block rounded-xl px-7 py-2.5 text-base font-bold text-[#1b1b1f] transition hover:brightness-110 shadow-md"
                  style={{ background: GOLD }}
                >
                  Pelajari Selengkapnya
                </Link>
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
                        borderColor: GOLD,
                        background: "#25695a",
                        opacity: 0.45 + i * 0.2,
                      }}
                    />
                  ))}

                  {/* Poster utama */}
                  <div
                    className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-[3px] shadow-2xl"
                    style={{ borderColor: GOLD }}
                  >
                    <Image
                      src={featuredProker.coverImageUrl || "/og-default.jpg"}
                      alt={featuredProker.name}
                      fill
                      className="object-cover"
                    />
                  </div>

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
                Salam Inovator <span className="ml-1">✊</span>
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
                    className="group relative flex w-48 sm:w-60 md:w-68 lg:w-76 xl:w-80 aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl sm:rounded-3xl border-2 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    style={{ borderColor: GOLD }}
                  >
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Badge kategori */}
                    <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                        style={{
                          background: "rgba(27, 27, 31, 0.8)",
                          color: GOLD_SOFT,
                          border: `1px solid ${GOLD}55`,
                        }}
                      >
                        {card.tag}
                      </span>
                    </div>

                    {/* Gradien gold di bagian bawah */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${GOLD} 0%, ${GOLD}f0 20%, ${GOLD}77 40%, transparent 68%)`,
                      }}
                    />

                    {/* Teks di atas overlay gold */}
                    <div className="relative z-10 p-3.5 sm:p-5 lg:p-6 text-[#1b1b1f]">
                      <h3 className="line-clamp-1 text-sm sm:text-base lg:text-lg font-bold uppercase tracking-tight">
                        {card.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-[11px] sm:text-xs lg:text-sm font-semibold leading-snug opacity-90">
                        {card.caption}
                      </p>
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
      <section className="relative pb-24 pt-4">
        <Sparkle className="left-[8%] top-8 hidden md:block" size={24} delay={0.8} float />
        <Sparkle className="right-[6%] top-12 hidden md:block" size={22} delay={1.1} />

        <div className="space-y-8">
          <h2
            className="text-center text-4xl font-bold uppercase sm:text-5xl lg:text-6xl"
            style={{ color: GOLD }}
          >
            Info Lomba
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

            <div className="pr-marquee-track-alt">
              {opportunityMarqueeItems.map((card, idx) => (
                <div key={`opp-${idx}`} className="shrink-0 pr-4 sm:pr-6 lg:pr-8">
                  <Link
                    href={card.href}
                    className="group relative flex w-48 sm:w-60 md:w-68 lg:w-76 xl:w-80 aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl sm:rounded-3xl border-2 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    style={{ borderColor: GOLD }}
                  >
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Badge kategori / tipe lomba */}
                    <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                        style={{
                          background: "rgba(27, 27, 31, 0.8)",
                          color: GOLD_SOFT,
                          border: `1px solid ${GOLD}55`,
                        }}
                      >
                        {card.tag}
                      </span>
                    </div>

                    {/* Gradien gold di bagian bawah */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${GOLD} 0%, ${GOLD}f0 20%, ${GOLD}77 40%, transparent 68%)`,
                      }}
                    />

                    {/* Teks di atas overlay gold */}
                    <div className="relative z-10 p-3.5 sm:p-5 lg:p-6 text-[#1b1b1f]">
                      <h3 className="line-clamp-1 text-sm sm:text-base lg:text-lg font-bold uppercase tracking-tight">
                        {card.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-[11px] sm:text-xs lg:text-sm font-semibold leading-snug opacity-90">
                        {card.caption}
                      </p>
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
    </div>
  );
}