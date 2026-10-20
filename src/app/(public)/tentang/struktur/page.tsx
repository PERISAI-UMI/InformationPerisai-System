import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struktur Organisasi — UKM PERISAI UMI",
  description:
    "Bagan hierarki struktural kepengurusan dan pedoman tata kelola UKM PERISAI Universitas Muslim Indonesia.",
};

const GOLD = "#FFB22C";
const BG = "#17171a";

/* ------------------------------------------------------------------ */
/* Bintang 4-sudut (Sparkle) beranimasi ala dashboard                  */
/* ------------------------------------------------------------------ */
function Sparkle({
  className = "",
  size = 22,
  delay = 0,
  float = false,
}: {
  className?: string;
  size?: number;
  delay?: number;
  float?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 ${className}`}
      style={{
        animation: `${float ? "pr-float 5.5s" : "pr-twinkle 3s"} ease-in-out ${delay}s infinite`,
        filter: `drop-shadow(0 0 7px ${GOLD}99)`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={GOLD}>
        <path d="M12 0C12.6 7 17 11.4 24 12C17 12.6 12.6 17 12 24C11.4 17 7 12.6 0 12C7 11.4 11.4 7 12 0Z" />
      </svg>
    </span>
  );
}

export default function StrukturPage() {
  const structuralPoints = [
    {
      no: "1",
      title: "Komposisi Lembaga",
      desc: "Struktur PERISAI UMI terdiri dari: Pembina, Dewan Pertimbangan Organisasi, pengurus inti dan staf ahli.",
    },
    {
      no: "2",
      title: "Dewan Pembina",
      desc: "Pembina adalah orang yang diamanahkan oleh birokrasi dalam hal ini Wakil Rektor III Universitas Muslim Indonesia.",
    },
    {
      no: "3",
      title: "Dewan Pertimbangan Organisasi",
      desc: "Dewan Pertimbangan Organisasi adalah demisioner PERISAI UMI yang berjumlah 7 orang.",
    },
    {
      no: "4",
      title: "Pengurus Inti",
      desc: "Pengurus inti meliputi Ketua, Sekretaris, Bendahara dan Kepala Departemen.",
    },
    {
      no: "5",
      title: "Staf Ahli",
      desc: "Staf Ahli adalah semua pengurus selain pengurus inti.",
    },
    {
      no: "6",
      title: "Anggota Biasa",
      desc: "Anggota biasa adalah generasi baru PERISAI UMI.",
    },
  ];

  return (
    <div
      className="relative text-white selection:bg-[#FFB22C] selection:text-[#1b1b1f] pb-6 sm:pb-8 overflow-hidden w-full max-w-[100vw]"
      style={{ background: BG }}
    >
      {/* Keyframes Animasi */}
      <style>{`
        @keyframes pr-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes pr-float {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50%      { transform: translateY(-10px); opacity: 1; }
        }
        @keyframes pr-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(1.05); }
        }
        @keyframes pr-dash-flow {
          to { stroke-dashoffset: -24; }
        }
      `}</style>

      {/* Ambient Glow di Latar Belakang (Dibatasi agar tidak melebar ke luar layar) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute top-[-60px] left-1/2 -translate-x-1/2 h-[460px] w-[800px] max-w-[90vw] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, rgba(255,178,44,0.18) 0%, transparent 70%)",
            animation: "pr-glow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[700px] right-0 h-[400px] w-[400px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(255,200,90,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[1100px] left-0 h-[400px] w-[400px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(255,178,44,0.08) 0%, transparent 70%)" }}
        />
      </div>

      {/* ======================================================== */}
      {/* 1. HERO HEADER                                           */}
      {/* ======================================================== */}
      <section className="relative pt-20 pb-10 sm:pt-24 sm:pb-12 text-center">
        <Sparkle className="top-14 left-[18%]" size={22} delay={0.2} float />
        <Sparkle className="top-20 right-[18%]" size={18} delay={1.4} />

        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB22C]/40 bg-[#FFB22C]/10 px-4 py-1 text-xs font-semibold tracking-widest uppercase text-[#FFB22C] mb-4">
            <span>✦</span>
            <span>STRUKTUR ORGANISASI</span>
            <span>✦</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-[#FFB22C]"
            style={{
              textShadow: "0 3px 30px rgba(255, 178, 44, 0.4)",
            }}
          >
            STRUKTUR ORGANISASI
          </h1>

          <p className="mt-2 text-base sm:text-xl font-bold uppercase tracking-[0.2em] text-white/90">
            PUSAT PENGEMBANGAN RISET MAHASISWA
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SECTION 1: BAGAN HIRARKI STRUKTURAL (POSISI PERTAMA)  */}
      {/* ======================================================== */}
      <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 space-y-16">
        <section className="relative w-full">
          <div className="rounded-2xl sm:rounded-3xl border border-[#FFB22C]/30 bg-[#202026]/90 p-2.5 sm:p-8 lg:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
            {/* Header Bagan */}
            <div className="text-center mb-6 sm:mb-8">
              <span className="inline-block rounded-full bg-[#FFB22C]/10 border border-[#FFB22C]/30 px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FFB22C]">
                ✦ Bagan Hirarki Struktural ✦
              </span>
              <h2 className="mt-2 text-xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Struktur Kepengurusan UKM PERISAI UMI
              </h2>
            </div>

            {/* Container Bagan Responsif Penuh (Tertampil Full di Layar Mobile) */}
            <div className="w-full flex justify-center select-none overflow-hidden">
              <div className="w-full max-w-6xl mx-auto flex justify-center select-none">
                <svg
                  className="w-full h-auto drop-shadow-2xl"
                  viewBox="0 0 1000 705"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Gradient Emas Ketua Umum */}
                    <linearGradient id="ketum-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2e2b22" />
                      <stop offset="50%" stopColor="#3d3828" />
                      <stop offset="100%" stopColor="#25221b" />
                    </linearGradient>

                    {/* Gradient Node Umum */}
                    <linearGradient id="node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#282833" />
                      <stop offset="100%" stopColor="#1c1c23" />
                    </linearGradient>

                    {/* Gradient Kadep Node */}
                    <linearGradient id="kadep-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#262630" />
                      <stop offset="100%" stopColor="#1a1a21" />
                    </linearGradient>
                  </defs>

                  {/* ======================================================== */}
                  {/* LAYER 1: FRAME KOTAK BESAR UTAMA (PENGURUS INTI)         */}
                  {/* ======================================================== */}
                  <rect
                    x="150"
                    y="95"
                    width="700"
                    height="495"
                    rx="26"
                    stroke="#484857"
                    strokeWidth="2.5"
                    fill="#1b1b22"
                    fillOpacity="0.85"
                  />

                  {/* ======================================================== */}
                  {/* LAYER 2: SELURUH GARIS KONEKTOR (TANPA FILTER BERMASALAH) */}
                  {/* ======================================================== */}
                  <g style={{ filter: "drop-shadow(0 0 5px rgba(255, 178, 44, 0.75))" }}>
                    {/* 1. Garis Putus-putus: Pembina Atas (500, 72) -> Ketua Umum (500, 143) */}
                    <line
                      x1="500"
                      y1="72"
                      x2="500"
                      y2="143"
                      stroke={GOLD}
                      strokeWidth="3"
                      strokeDasharray="8 8"
                      style={{ animation: "pr-dash-flow 1.5s linear infinite" }}
                    />

                    {/* 2. Garis Putus-putus Horizontal: Pembina Kiri (180, 175) -> Ketua Umum (365, 175) */}
                    <line
                      x1="180"
                      y1="175"
                      x2="365"
                      y2="175"
                      stroke={GOLD}
                      strokeWidth="3"
                      strokeDasharray="8 8"
                      style={{ animation: "pr-dash-flow 1.5s linear infinite" }}
                    />

                    {/* 3. Garis Putus-putus Horizontal: Ketua Umum (635, 175) -> DPO Kanan (820, 175) */}
                    <line
                      x1="635"
                      y1="175"
                      x2="820"
                      y2="175"
                      stroke={GOLD}
                      strokeWidth="3"
                      strokeDasharray="8 8"
                      style={{ animation: "pr-dash-flow 1.5s linear infinite" }}
                    />

                    {/* 4. Garis Putus-putus: Dari DPO (902, 202) turun & belok ke Kadep */}
                    <path
                      d="M 902 202 L 902 325 L 785 325"
                      stroke={GOLD}
                      strokeWidth="3"
                      strokeDasharray="8 8"
                      fill="none"
                      style={{ animation: "pr-dash-flow 1.5s linear infinite" }}
                    />

                    {/* 5. Garis Komando Solid: Ketua Umum (500, 207) -> Pimpinan Inti (Sekum & Bendum) */}
                    <line
                      x1="500"
                      y1="207"
                      x2="500"
                      y2="230"
                      stroke={GOLD}
                      strokeWidth="3"
                    />
                    {/* Cabang Horizontal Pimpinan Sekretariat & Keuangan */}
                    <line
                      x1="340"
                      y1="230"
                      x2="660"
                      y2="230"
                      stroke={GOLD}
                      strokeWidth="3"
                    />
                    {/* Turun ke Sekum */}
                    <line
                      x1="340"
                      y1="230"
                      x2="340"
                      y2="252"
                      stroke={GOLD}
                      strokeWidth="3"
                    />
                    {/* Turun ke Bendum */}
                    <line
                      x1="660"
                      y1="230"
                      x2="660"
                      y2="252"
                      stroke={GOLD}
                      strokeWidth="3"
                    />

                    {/* 6. Garis Komando Solid: Pimpinan Utama turun ke Garis Busur Kadep */}
                    <line
                      x1="500"
                      y1="230"
                      x2="500"
                      y2="325"
                      stroke={GOLD}
                      strokeWidth="3"
                    />
                    {/* Garis Horizontal Busur Kadep */}
                    <line
                      x1="215"
                      y1="325"
                      x2="785"
                      y2="325"
                      stroke={GOLD}
                      strokeWidth="3"
                    />
                    {/* Cabang Turun ke 6 Kadep */}
                    {[215, 329, 443, 557, 671, 785].map((x, i) => (
                      <line
                        key={`top-kadep-${i}`}
                        x1={x}
                        y1="325"
                        x2={x}
                        y2="355"
                        stroke={GOLD}
                        strokeWidth="3"
                      />
                    ))}

                    {/* 7. Garis Turun dari 6 Kadep ke Garis Pengumpul */}
                    {[215, 329, 443, 557, 671, 785].map((x, i) => (
                      <line
                        key={`bot-kadep-${i}`}
                        x1={x}
                        y1="409"
                        x2={x}
                        y2="445"
                        stroke={GOLD}
                        strokeWidth="3"
                      />
                    ))}
                    {/* Garis Pengumpul Horizontal Kadep */}
                    <line
                      x1="215"
                      y1="445"
                      x2="785"
                      y2="445"
                      stroke={GOLD}
                      strokeWidth="3"
                    />
                    {/* Turun dari garis pengumpul ke Top Staf Ahli */}
                    <line
                      x1="500"
                      y1="445"
                      x2="500"
                      y2="480"
                      stroke={GOLD}
                      strokeWidth="3"
                    />

                    {/* 8. Garis Putus-putus: Staf Ahli (500, 538) -> Anggota Biasa (500, 634) */}
                    <line
                      x1="500"
                      y1="538"
                      x2="500"
                      y2="634"
                      stroke={GOLD}
                      strokeWidth="3"
                      strokeDasharray="8 8"
                      style={{ animation: "pr-dash-flow 1.5s linear infinite" }}
                    />
                  </g>

                  {/* ======================================================== */}
                  {/* LAYER 3: SELURUH KOTAK JABATAN DENGAN TEKS PROPORSI PAS  */}
                  {/* ======================================================== */}

                  {/* 1. PEMBINA ATAS */}
                  <g className="cursor-pointer">
                    <rect
                      x="375"
                      y="18"
                      width="250"
                      height="54"
                      rx="14"
                      fill="url(#node-grad)"
                      stroke={GOLD}
                      strokeWidth="2.5"
                    />
                    <text
                      x="500"
                      y="51"
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="800"
                      fill="#FFFFFF"
                      letterSpacing="1.5"
                    >
                      PEMBINA
                    </text>
                  </g>

                  {/* 2. PEMBINA KIRI */}
                  <g className="cursor-pointer">
                    <rect
                      x="15"
                      y="148"
                      width="165"
                      height="54"
                      rx="14"
                      fill="url(#node-grad)"
                      stroke={GOLD}
                      strokeWidth="2.2"
                    />
                    <text
                      x="97"
                      y="181"
                      textAnchor="middle"
                      fontSize="14.5"
                      fontWeight="800"
                      fill="#FFFFFF"
                      letterSpacing="1"
                    >
                      PEMBINA
                    </text>
                  </g>

                  {/* 3. DPO KANAN */}
                  <g className="cursor-pointer">
                    <rect
                      x="820"
                      y="148"
                      width="165"
                      height="54"
                      rx="14"
                      fill="url(#node-grad)"
                      stroke={GOLD}
                      strokeWidth="2.2"
                    />
                    <text
                      x="902"
                      y="181"
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="800"
                      fill="#FFFFFF"
                      letterSpacing="1.5"
                    >
                      DPO
                    </text>
                  </g>

                  {/* 4. KETUA UMUM (PUNCAK FRAME UTAMA) */}
                  <g className="cursor-pointer">
                    <rect
                      x="365"
                      y="143"
                      width="270"
                      height="64"
                      rx="16"
                      fill="url(#ketum-grad)"
                      stroke={GOLD}
                      strokeWidth="3"
                    />
                    <text
                      x="500"
                      y="182"
                      textAnchor="middle"
                      fontSize="18.5"
                      fontWeight="900"
                      fill={GOLD}
                      letterSpacing="1.5"
                    >
                      KETUA UMUM
                    </text>
                  </g>

                  {/* 5. SEKRETARIS UMUM */}
                  <g className="cursor-pointer">
                    <rect
                      x="220"
                      y="252"
                      width="240"
                      height="54"
                      rx="14"
                      fill="url(#node-grad)"
                      stroke={GOLD}
                      strokeWidth="2.2"
                    />
                    <text
                      x="340"
                      y="284"
                      textAnchor="middle"
                      fontSize="13.5"
                      fontWeight="800"
                      fill="#FFFFFF"
                      letterSpacing="0.8"
                    >
                      SEKRETARIS UMUM
                    </text>
                  </g>

                  {/* 6. BENDAHARA UMUM */}
                  <g className="cursor-pointer">
                    <rect
                      x="540"
                      y="252"
                      width="240"
                      height="54"
                      rx="14"
                      fill="url(#node-grad)"
                      stroke={GOLD}
                      strokeWidth="2.2"
                    />
                    <text
                      x="660"
                      y="284"
                      textAnchor="middle"
                      fontSize="13.5"
                      fontWeight="800"
                      fill="#FFFFFF"
                      letterSpacing="0.8"
                    >
                      BENDAHARA UMUM
                    </text>
                  </g>

                  {/* 7. JAJARAN 6 KEPALA DEPARTEMEN */}
                  {[
                    { x: 169, line1: "KADEP", line2: "PENALARAN" },
                    { x: 283, line1: "KADEP", line2: "MEDIA" },
                    { x: 397, line1: "KADEP", line2: "RISTEK" },
                    { x: 511, line1: "KADEP", line2: "KOMPRES" },
                    { x: 625, line1: "KADEP", line2: "PSDM" },
                    { x: 739, line1: "KADEP", line2: "HUMAS" },
                  ].map((kadep, idx) => (
                    <g key={idx} className="cursor-pointer">
                      <rect
                        x={kadep.x}
                        y="355"
                        width="92"
                        height="54"
                        rx="12"
                        fill="url(#kadep-grad)"
                        stroke="#606070"
                        strokeWidth="1.8"
                        className="hover:stroke-[#FFB22C] transition-colors"
                      />
                      <text
                        x={kadep.x + 46}
                        y="374"
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="800"
                        fill={GOLD}
                        letterSpacing="1"
                      >
                        {kadep.line1}
                      </text>
                      <text
                        x={kadep.x + 46}
                        y="394"
                        textAnchor="middle"
                        fontSize="11.5"
                        fontWeight="800"
                        fill="#FFFFFF"
                        letterSpacing="0"
                      >
                        {kadep.line2}
                      </text>
                    </g>
                  ))}

                  {/* 8. STAF AHLI DEPARTEMEN */}
                  <g className="cursor-pointer">
                    <rect
                      x="345"
                      y="480"
                      width="310"
                      height="58"
                      rx="14"
                      fill="url(#node-grad)"
                      stroke={GOLD}
                      strokeWidth="2.5"
                    />
                    <text
                      x="500"
                      y="515"
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="800"
                      fill="#FFFFFF"
                      letterSpacing="1"
                    >
                      STAF AHLI DEPARTEMEN
                    </text>
                  </g>

                  {/* 9. ANGGOTA BIASA (DI LUAR KOTAK BESAR BAWAH) */}
                  <g className="cursor-pointer">
                    <rect
                      x="365"
                      y="634"
                      width="270"
                      height="54"
                      rx="14"
                      fill="url(#node-grad)"
                      stroke="#808090"
                      strokeWidth="2"
                      className="hover:stroke-[#FFB22C] transition-colors"
                    />
                    <text
                      x="500"
                      y="666"
                      textAnchor="middle"
                      fontSize="14.5"
                      fontWeight="800"
                      fill="#FFFFFF"
                      letterSpacing="1"
                    >
                      ANGGOTA BIASA
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. SECTION 2: KETENTUAN & TATA KELOLA (POSISI KEDUA)     */}
        {/* ======================================================== */}
        <section className="relative w-full">
          <div className="rounded-3xl border border-[#FFB22C]/25 bg-[#202026]/90 p-6 sm:p-10 backdrop-blur-md shadow-xl">
            <div className="mb-8 pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block rounded-full bg-[#FFB22C]/10 border border-[#FFB22C]/30 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#FFB22C]">
                  Ketentuan & Tata Kelola
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
                  Pedoman Struktur Kepengurusan PERISAI UMI
                </h2>
              </div>
              <span className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-xs text-zinc-300 font-semibold w-fit">
                6 Poin Hirarki
              </span>
            </div>

            {/* 6 Poin Hirarki dalam Grid 2 Kolom Elegan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {structuralPoints.map((item) => (
                <div
                  key={item.no}
                  className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:border-[#FFB22C]/40 hover:bg-[#FFB22C]/5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFB22C]/15 border border-[#FFB22C]/30 text-sm font-black text-[#FFB22C] shadow-sm">
                    {item.no}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FFB22C] transition-colors mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
