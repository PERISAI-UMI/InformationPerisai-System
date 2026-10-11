import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi, Misi, dan Tujuan — UKM PERISAI UMI",
  description:
    "Visi, misi, dan tujuan resmi UKM PERISAI Universitas Muslim Indonesia sebagai pusat pengembangan riset mahasiswa.",
};

const GOLD = "#FFB22C";
const BG = "#17171a";

/* ------------------------------------------------------------------ */
/* Bintang 4-sudut (Sparkle) beranimasi ala dashboard                  */
/* ------------------------------------------------------------------ */
function Sparkle({
  className = "",
  size = 20,
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

export default function VisiMisiPage() {
  const missions = [
    "Mengembangkan budaya ilmiah di lingkungan mahasiswa melalui pembinaan riset, penalaran, dan inovasi.",
    "Menyelenggarakan pelatihan, workshop, dan program pembinaan berkelanjutan untuk meningkatkan kompetensi anggota.",
    "Mendorong mahasiswa aktif berpartisipasi pada kompetisi ilmiah seperti PKM, esai, debat, karya tulis, dan inovasi teknologi.",
    "Memfasilitasi kolaborasi antar departemen dan antar lembaga demi menciptakan karya riset yang produktif dan bermanfaat.",
    "Menjalin kemitraan dengan pihak kampus maupun eksternal untuk memperluas peluang pengembangan inovasi.",
    "Menghadirkan lingkungan organisasi yang profesional, inklusif, dan berlandaskan nilai keislaman.",
  ];

  const goals = [
    "Mencetak mahasiswa yang unggul dalam riset, PKM, dan inovasi teknologi.",
    "Menjadi wadah pembinaan bagi mahasiswa UMI untuk mencapai prestasi ilmiah tingkat regional, nasional, hingga internasional.",
    "Menghasilkan karya riset dan inovasi yang bermanfaat bagi masyarakat, kampus, dan pengembangan keilmuan.",
    "Mewadahi kader-kader inovator untuk mengembangkan potensi akademik dan kreativitas secara maksimal.",
    "Menguatkan reputasi UMI sebagai kampus yang aktif dalam pengembangan riset dan inovasi.",
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
      `}</style>

      {/* Ambient Glow di Latar Belakang (Clipped so it NEVER extends container height) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute top-[-60px] left-1/2 -translate-x-1/2 h-[460px] w-[860px] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, rgba(255,178,44,0.18) 0%, transparent 70%)",
            animation: "pr-glow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[350px] -right-32 h-[400px] w-[400px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(255,200,90,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 -left-32 h-[400px] w-[400px] rounded-full blur-[130px]"
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
            <span>VISI, MISI & TUJUAN</span>
            <span>✦</span>
          </div>

          <h1
            className="text-4xl sm:text-6xl font-black uppercase tracking-wider text-[#FFB22C]"
            style={{
              textShadow: "0 3px 30px rgba(255, 178, 44, 0.4)",
            }}
          >
            VISI & MISI
          </h1>

          <p className="mt-2 text-base sm:text-xl font-bold uppercase tracking-[0.2em] text-white/90">
            PUSAT PENGEMBANGAN RISET MAHASISWA
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. GRID UTAMA (2 DI KIRI, 1 DI KANAN, TINGGI SEIMBANG)   */}
      {/* ======================================================== */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* ---------------------------------------------------- */}
          {/* KOLOM KIRI: 2 KOTAK TERSUSUN VERTIKAL                */}
          {/* ---------------------------------------------------- */}
          <div className="flex flex-col gap-6 h-full">
            {/* KOTAK KIRI 1: VISI PERISAI UMI (KOMPAK & RAMPING)    */}
            <div className="shrink-0 rounded-3xl border border-[#FFB22C]/25 bg-[#202026]/85 p-5 sm:p-6 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFB22C]/50 relative overflow-hidden">
              <Sparkle className="top-4 right-6" size={16} delay={0.5} />

              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                VISI PERISAI UMI
              </h2>

              <div className="mt-2.5 rounded-2xl border border-[#FFB22C]/30 bg-[#FFB22C]/5 p-3.5 sm:p-4">
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-100 font-medium italic">
                  &ldquo;Menjadi organisasi mahasiswa yang unggul dalam riset, inovasi, dan pengembangan penalaran ilmiah untuk menciptakan generasi inovator yang kompeten, berintegritas, dan berdaya saing di tingkat nasional maupun internasional.&rdquo;
                </p>
              </div>
            </div>

            {/* KOTAK KIRI 2: TUJUAN (LEBIH BESAR & LEGA)            */}
            <div className="flex-1 rounded-3xl border border-[#FFB22C]/25 bg-[#202026]/85 p-6 sm:p-7 lg:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFB22C]/50 flex flex-col justify-center relative overflow-hidden">
              <Sparkle className="top-4 right-6" size={16} delay={1.6} float />

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                TUJUAN
              </h2>

              <div className="mt-4 space-y-2.5 sm:space-y-3">
                {goals.map((goal, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all duration-200 hover:border-[#FFB22C]/30 hover:bg-[#FFB22C]/5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#FFB22C]/15 text-[#FFB22C] font-mono text-[11px] font-bold border border-[#FFB22C]/25 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm md:text-base text-zinc-200 leading-snug">
                      {goal}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* KOLOM KANAN: 1 KOTAK (MISI PERISAI UMI)              */}
          {/* ---------------------------------------------------- */}
          <div className="flex flex-col h-full">
            <div className="h-full rounded-3xl border border-[#FFB22C]/25 bg-[#202026]/85 p-6 sm:p-7 lg:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFB22C]/50 flex flex-col justify-center relative overflow-hidden">
              <Sparkle className="top-5 right-7" size={18} delay={1.1} float />

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                MISI PERISAI UMI
              </h2>

              {/* 6 Butir Misi */}
              <div className="mt-4 space-y-2.5">
                {missions.map((mission, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all duration-200 hover:border-[#FFB22C]/30 hover:bg-[#FFB22C]/5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#FFB22C]/15 text-[#FFB22C] font-mono text-[11px] font-bold border border-[#FFB22C]/25 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm md:text-base text-zinc-200 leading-snug">
                      {mission}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
