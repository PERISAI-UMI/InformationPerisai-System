import Image from "next/image";
import Link from "next/link";
import { AboutNavTabs } from "@/features/about/components/AboutNavTabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi, Misi, dan Tujuan — UKM PERISAI UMI",
  description:
    "Visi organisasi, 6 misi strategis, dan 5 pilar tujuan UKM PERISAI Universitas Muslim Indonesia sebagai pusat pengembangan riset mahasiswa.",
};

export default function VisiMisiPage() {
  const missions = [
    {
      no: "1",
      title: "Budaya Ilmiah Berkelanjutan",
      desc: "Mengembangkan budaya ilmiah di lingkungan mahasiswa melalui pembinaan riset, penalaran, dan inovasi.",
    },
    {
      no: "2",
      title: "Pelatihan & Workshop Intensif",
      desc: "Menyelenggarakan pelatihan, workshop, dan program pembinaan berkelanjutan untuk meningkatkan kompetensi anggota.",
    },
    {
      no: "3",
      title: "Kompetisi & Partisipasi Nasional",
      desc: "Mendorong mahasiswa aktif berpartisipasi pada kompetisi ilmiah seperti PKM, esai, debat, karya tulis, dan inovasi teknologi.",
    },
    {
      no: "4",
      title: "Kolaborasi Riset Lintas Lembaga",
      desc: "Memfasilitasi kolaborasi antar departemen dan antar lembaga demi menciptakan karya riset yang produktif dan bermanfaat.",
    },
    {
      no: "5",
      title: "Kemitraan Strategis Kampus & Eksternal",
      desc: "Menjalin kemitraan dengan pihak kampus maupun eksternal untuk memperluas peluang pengembangan inovasi.",
    },
    {
      no: "6",
      title: "Profesionalisme Berlandaskan Nilai Islam",
      desc: "Menghadirkan lingkungan organisasi yang profesional, inklusif, dan berlandaskan nilai keislaman.",
    },
  ];

  const goals = [
    {
      no: "1",
      title: "Kader Riset & Inovasi",
      desc: "Mencetak mahasiswa yang unggul dalam riset, PKM, dan inovasi teknologi.",
    },
    {
      no: "2",
      title: "Prestasi Multilevel",
      desc: "Menjadi wadah pembinaan bagi mahasiswa UMI untuk mencapai prestasi ilmiah tingkat regional, nasional, hingga internasional.",
    },
    {
      no: "3",
      title: "Kemanfaatan Nyata bagi Umat",
      desc: "Menghasilkan karya riset dan inovasi yang bermanfaat bagi masyarakat, kampus, dan pengembangan keilmuan.",
    },
    {
      no: "4",
      title: "Wadah Potensi Inovator",
      desc: "Mewadahi kader-kader inovator untuk mengembangkan potensi akademik dan kreativitas secara maksimal.",
    },
    {
      no: "5",
      title: "Penguatan Reputasi Almamater",
      desc: "Menguatkan reputasi UMI sebagai kampus yang aktif dalam pengembangan riset dan inovasi.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1b1b1f] text-[#ECECEC] pb-24">
      {/* ======================================================== */}
      {/* 1. HERO HEADER WITH CAMPUS IMAGE OVERLAY                 */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-[#FFB22C]/20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/og-default.jpg"
            alt="Universitas Muslim Indonesia"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1b1f]/80 via-[#1b1b1f]/90 to-[#1b1b1f]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[120px] pointer-events-none opacity-30"
            style={{ background: "radial-gradient(circle, #FFB22C 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-[#FFB22C]"
            style={{
              textShadow: "0 4px 30px rgba(255, 178, 44, 0.45)",
            }}
          >
            VISI, MISI, DAN TUJUAN
          </h1>
          <p className="mt-2 text-base sm:text-xl md:text-2xl font-black uppercase tracking-widest text-white drop-shadow-md">
            PUSAT PENGEMBANGAN RISET MAHASISWA
          </p>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-medium">
            Komitmen arah juang, standar mutu, serta sasaran strategis jangka panjang UKM PERISAI Universitas Muslim Indonesia
          </p>

          {/* Subpage Nav Tabs */}
          <div className="mt-8 flex justify-center">
            <AboutNavTabs />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. MAIN SPLIT CONTENT: NARRATIVE + SHOWCASE CARDS        */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Narrative with Exact Golden Badges */}
          <div className="lg:col-span-7 space-y-8">
            {/* Block 1: VISI PERISAI UMI */}
            <div className="rounded-2xl border border-[#FFB22C]/20 bg-[#2b2b31]/80 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFB22C]/40">
              <span className="inline-block rounded-md bg-[#FFB22C] px-3.5 py-1.5 text-xs sm:text-sm font-black text-[#1b1b1f] shadow-sm mb-4">
                VISI PERISAI UMI
              </span>
              <p className="text-base sm:text-lg font-bold leading-relaxed text-white">
                &ldquo;Menjadi organisasi mahasiswa yang unggul dalam riset, inovasi, dan pengembangan penalaran ilmiah untuk menciptakan generasi inovator yang kompeten, berintegritas, dan berdaya saing di tingkat nasional maupun internasional.&rdquo;
              </p>
            </div>

            {/* Block 2: MISI PERISAI UMI */}
            <div className="rounded-2xl border border-[#FFB22C]/20 bg-[#2b2b31]/80 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFB22C]/40">
              <span className="inline-block rounded-md bg-[#FFB22C] px-3.5 py-1.5 text-xs sm:text-sm font-black text-[#1b1b1f] shadow-sm mb-4">
                MISI PERISAI UMI
              </span>
              <ol className="space-y-3.5 text-sm sm:text-base text-zinc-200 pl-1 list-none">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    1
                  </span>
                  <span>Mengembangkan budaya ilmiah di lingkungan mahasiswa melalui pembinaan riset, penalaran, dan inovasi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    2
                  </span>
                  <span>Menyelenggarakan pelatihan, workshop, dan program pembinaan berkelanjutan untuk meningkatkan kompetensi anggota.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    3
                  </span>
                  <span>Mendorong mahasiswa aktif berpartisipasi pada kompetisi ilmiah seperti PKM, esai, debat, karya tulis, dan inovasi teknologi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    4
                  </span>
                  <span>Memfasilitasi kolaborasi antar departemen dan antar lembaga demi menciptakan karya riset yang produktif dan bermanfaat.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    5
                  </span>
                  <span>Menjalin kemitraan dengan pihak kampus maupun eksternal untuk memperluas peluang pengembangan inovasi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    6
                  </span>
                  <span>Menghadirkan lingkungan organisasi yang profesional, inklusif, dan berlandaskan nilai keislaman.</span>
                </li>
              </ol>
            </div>

            {/* Block 3: TUJUAN */}
            <div className="rounded-2xl border border-[#FFB22C]/20 bg-[#2b2b31]/80 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFB22C]/40">
              <span className="inline-block rounded-md bg-[#FFB22C] px-3.5 py-1.5 text-xs sm:text-sm font-black text-[#1b1b1f] shadow-sm mb-4">
                TUJUAN
              </span>
              <ol className="space-y-3.5 text-sm sm:text-base text-zinc-200 pl-1 list-none">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    1
                  </span>
                  <span>Mencetak mahasiswa yang unggul dalam riset, PKM, dan inovasi teknologi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    2
                  </span>
                  <span>Menjadi wadah pembinaan bagi mahasiswa UMI untuk mencapai prestasi ilmiah tingkat regional, nasional, hingga internasional.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    3
                  </span>
                  <span>Menghasilkan karya riset dan inovasi yang bermanfaat bagi masyarakat, kampus, dan pengembangan keilmuan.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    4
                  </span>
                  <span>Mewadahi kader-kader inovator untuk mengembangkan potensi akademik dan kreativitas secara maksimal.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    5
                  </span>
                  <span>Menguatkan reputasi UMI sebagai kampus yang aktif dalam pengembangan riset dan inovasi.</span>
                </li>
              </ol>
            </div>
          </div>

          {/* RIGHT COLUMN: 2 High-Aesthetic Showcase Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Slot 1: Keunggulan Inovasi */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#2b2b31] to-[#1e1e24] p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-[#FFB22C] hover:shadow-[0_0_25px_rgba(255,178,44,0.25)]">
              <div className="relative h-48 w-full rounded-xl overflow-hidden mb-5 border border-white/10">
                <Image
                  src="/og-default.jpg"
                  alt="Kampus Riset UMI"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-md bg-[#FFB22C] px-2.5 py-1 text-[11px] font-black text-[#1b1b1f]">
                    Pilar Inovasi
                  </span>
                  <span className="text-[11px] font-bold text-white drop-shadow">
                    Karya Berdampak
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFB22C]">
                Inkubator Prestasi Ilmiah
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Kultur Berpikir Kritis & Solutif
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Membina generasi mahasiswa UMI agar tidak hanya menjadi konsumen ilmu, namun juga produsen riset dan teknologi yang memecahkan problematika kemasyarakatan.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-white/10">
                <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-bold text-zinc-300 border border-white/10">
                  ✓ Bimbingan PKM & PIMNAS
                </span>
                <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-bold text-zinc-300 border border-white/10">
                  ✓ Penulisan KTI Terapan
                </span>
                <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-bold text-zinc-300 border border-white/10">
                  ✓ Inovasi Prototipe IoT & Sains
                </span>
              </div>
            </div>

            {/* Slot 2: Integritas Keislaman */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#2b2b31] to-[#1e1e24] p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-[#FFB22C] hover:shadow-[0_0_25px_rgba(255,178,44,0.25)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 shrink-0 rounded-xl bg-[#1b1b1f] border border-[#FFB22C]/40 p-2 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/logoperisaidengantulisan.png"
                    alt="Logo PERISAI UMI"
                    width={56}
                    height={56}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#FFB22C]">
                    Moralitas & Karakter
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Riset Berakhlakul Karimah
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Menyelaraskan kejujuran ilmiah, etika akademis, dan nilai-nilai Islam rahmatan lil &lsquo;alamin, sehingga setiap produk riset membawa maslahat bagi almamater, bangsa, dan peradaban.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-white/10">
                <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-bold text-zinc-300 border border-white/10">
                  ✓ Kejujuran Akademik
                </span>
                <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-bold text-zinc-300 border border-white/10">
                  ✓ Kemaslahatan Ummat
                </span>
                <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-bold text-zinc-300 border border-white/10">
                  ✓ Kolaborasi Inklusif
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE 6 MISI TILES                              */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-white/10">
        <div className="text-center mb-12">
          <span className="rounded-full bg-[#FFB22C]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FFB22C] border border-[#FFB22C]/30">
            Pilar Pelaksanaan
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-white">
            6 Fokus Misi Operasional
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Pengejawantahan strategi pengurus UKM PERISAI UMI dalam setiap divisi kerja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((m) => (
            <div
              key={m.no}
              className="group rounded-2xl border border-white/10 bg-[#2b2b31]/70 p-6 backdrop-blur-md shadow-md transition-all duration-300 hover:border-[#FFB22C]/60 hover:bg-[#2b2b31] hover:shadow-[0_0_20px_rgba(255,178,44,0.15)]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-2xl font-black text-[#FFB22C]">
                  0{m.no}
                </span>
                <span className="text-xs text-zinc-400 group-hover:text-[#FFB22C] transition-colors">
                  Misi Strategis
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-white group-hover:text-[#FFB22C] transition-colors">
                {m.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. 5 PILAR TUJUAN CARD GRID                              */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#2b2b31] via-[#222228] to-[#1b1b1f] p-8 sm:p-12 shadow-2xl">
          <div className="text-center sm:text-left max-w-2xl mb-8">
            <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1b1b1f]">
              Sasaran Capaian
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              5 Pilar Sasaran Capaian Organisasi
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Hasil nyata yang didedikasikan bagi mahasiswa Universitas Muslim Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {goals.map((g) => (
              <div
                key={g.no}
                className="rounded-xl border border-white/5 bg-white/5 p-5 transition-all hover:border-[#FFB22C]/40 hover:bg-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFB22C] text-xs font-black text-[#1b1b1f]">
                    {g.no}
                  </span>
                  <h3 className="text-sm font-bold text-white">{g.title}</h3>
                </div>
                <p className="mt-3 text-xs text-zinc-300 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Ingin Mengetahui Struktur Fungsionaris?</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Lihat bagan struktural pembina, pengurus inti, dan pembagian departemen.
              </p>
            </div>
            <Link
              href="/tentang/struktur"
              className="rounded-xl bg-[#FFB22C] px-6 py-2.5 text-xs font-black text-[#1b1b1f] hover:bg-[#FFC85A] transition shadow-[0_0_15px_rgba(255,178,44,0.3)] whitespace-nowrap"
            >
              Lihat Struktur Organisasi →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
