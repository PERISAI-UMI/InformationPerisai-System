import Image from "next/image";
import Link from "next/link";
import { AboutNavTabs } from "@/features/about/components/AboutNavTabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sejarah PERISAI UMI — Pusat Pengembangan Riset Mahasiswa",
  description:
    "Lintas sejarah pendirian, perkembangan kontribusi, dan peran strategis UKM PERISAI Universitas Muslim Indonesia.",
};

const GOLD = "#FFB22C";

export default function SejarahPage() {
  const milestones = [
    {
      year: "2015",
      title: "Deklarasi & Inisiasi Berdirinya Organisasi",
      desc: "Pada tanggal 5 Mei 2015 di Kampus II UMI Makassar, sekelompok mahasiswa periset dari berbagai fakultas menginisiasi wadah penelitian ilmiah terpadu di bawah naungan nilai-nilai keislaman.",
    },
    {
      year: "2017",
      title: "Pengakuan Universitas & Kiprah PIMNAS Perdana",
      desc: "Mendapatkan Surat Keputusan resmi Rektorat Universitas Muslim Indonesia dan berhasil meloloskan tim delegasi perdana ke Pekan Ilmiah Mahasiswa Nasional (PIMNAS).",
    },
    {
      year: "2019",
      title: "Ekspansi Departemen Riset Terapan",
      desc: "Memperluas struktur riset dengan pembagian fokus fungsional serta meluncurkan program pembinaan kepenulisan karya tulis ilmiah (KTI) intensif lintas disiplin ilmu.",
    },
    {
      year: "2021",
      title: "Akselerasi Hibah Prestasi Nasional",
      desc: "Mencapai rekor pendanaan proposal PKM (Program Kreativitas Mahasiswa), program P2MW (Kewirausahaan Mahasiswa), dan hibah PPK Ormawa tingkat Kemendikbudristek.",
    },
    {
      year: "2026/2027",
      title: "Transformasi Digital & Ekosistem Riset Modern",
      desc: "Meluncurkan portal sistem informasi terpadu UKM PERISAI UMI, digitalisasi arsip karya riset fungsionaris, dan memperluas jejaring inovasi berbasis teknologi.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1b1b1f] text-[#ECECEC] pb-24">
      {/* ======================================================== */}
      {/* 1. HERO HEADER WITH CAMPUS IMAGE OVERLAY                 */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-[#FFB22C]/20">
        {/* Background Campus Image with Deep Atmospheric Gradient */}
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
          {/* Main Title Badge */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider text-[#FFB22C]"
            style={{
              textShadow: "0 4px 30px rgba(255, 178, 44, 0.45)",
            }}
          >
            SEJARAH
          </h1>
          <p className="mt-2 text-base sm:text-xl md:text-2xl font-black uppercase tracking-widest text-white drop-shadow-md">
            PUSAT PENGEMBANGAN RISET MAHASISWA
          </p>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-medium">
            Mengenal tonggak perjalanan, rekam jejak dedikasi, dan peran strategis UKM PERISAI Universitas Muslim Indonesia
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
          {/* LEFT COLUMN: Narrative with Golden Badges */}
          <div className="lg:col-span-7 space-y-8">
            {/* Block 1: Sejarah PERISAI UMI */}
            <div className="rounded-2xl border border-[#FFB22C]/20 bg-[#2b2b31]/80 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFB22C]/40">
              <span className="inline-block rounded-md bg-[#FFB22C] px-3.5 py-1.5 text-xs sm:text-sm font-black text-[#1b1b1f] shadow-sm mb-4">
                Sejarah PERISAI UMI (Pusat Pengembangan Riset Mahasiswa UMI)
              </span>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
                PERISAI UMI merupakan Unit Kegiatan Mahasiswa (UKM) resmi Universitas Muslim Indonesia yang berfokus pada pengembangan penalaran, riset, inovasi, dan kompetisi ilmiah. UKM ini lahir sebagai respon atas meningkatnya kebutuhan mahasiswa UMI untuk memiliki wadah pembinaan yang terarah dalam karya tulis ilmiah, PKM, penelitian, dan pengembangan teknologi.
              </p>
            </div>

            {/* Block 2: Awal Berdiri */}
            <div className="rounded-2xl border border-[#FFB22C]/20 bg-[#2b2b31]/80 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFB22C]/40">
              <span className="inline-block rounded-md bg-[#FFB22C] px-3.5 py-1.5 text-xs sm:text-sm font-black text-[#1b1b1f] shadow-sm mb-4">
                Awal Berdiri
              </span>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-200 mb-3">
                PERISAI UMI dibentuk oleh sekelompok mahasiswa yang aktif dalam kegiatan akademik dan riset, yang melihat bahwa UMI memerlukan komunitas formal untuk:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-zinc-300 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Meningkatkan budaya ilmiah,</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Mendorong mahasiswa ikut lomba tingkat regional hingga nasional,</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Mempersiapkan kader unggul,</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Mengembangkan inovasi di bidang teknologi dan penelitian sosial.</span>
                </li>
              </ul>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-200 pt-3 border-t border-white/10">
                Melalui dukungan pimpinan universitas dan semangat para pendiri, PERISAI UMI resmi disahkan sebagai UKM yang menaungi kegiatan riset dan inovasi mahasiswa.
              </p>
            </div>

            {/* Block 3: Perkembangan dan Kontribusi */}
            <div className="rounded-2xl border border-[#FFB22C]/20 bg-[#2b2b31]/80 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFB22C]/40">
              <span className="inline-block rounded-md bg-[#FFB22C] px-3.5 py-1.5 text-xs sm:text-sm font-black text-[#1b1b1f] shadow-sm mb-4">
                Perkembangan dan Kontribusi
              </span>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-200 mb-3">
                Sejak berdiri, PERISAI UMI terus berkembang melalui:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-zinc-300 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Pembentukan 6 departemen fungsional: PSDM, KOMPRES, HUMAS, RISTEK, Penalaran, dan Media,</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Pembinaan intensif karya ilmiah, PKM, riset, dan teknologi,</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Keterlibatan aktif dalam event nasional,</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Pencapaian prestasi mahasiswa UMI di berbagai lomba dan kompetisi.</span>
                </li>
              </ul>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-200 pt-3 border-t border-white/10">
                PERISAI UMI juga menjadi rumah bagi para <strong className="text-[#FFB22C]">&ldquo;Inovator&rdquo;</strong> sebutan bagi anggotanya, untuk berkolaborasi, berkreasi, dan berkontribusi bagi kampus.
              </p>
            </div>

            {/* Block 4: Peran di UMI */}
            <div className="rounded-2xl border border-[#FFB22C]/20 bg-[#2b2b31]/80 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFB22C]/40">
              <span className="inline-block rounded-md bg-[#FFB22C] px-3.5 py-1.5 text-xs sm:text-sm font-black text-[#1b1b1f] shadow-sm mb-4">
                Peran di UMI
              </span>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-200 mb-3">
                UKM ini kini menjadi garda terdepan dalam:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-zinc-300 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Pengembangan budaya akademik,</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Pembinaan mahasiswa berprestasi,</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Penguatan identitas UMI sebagai kampus riset dan inovasi,</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFB22C] text-lg font-bold leading-none">•</span>
                  <span>Membawa nama baik kampus melalui berbagai prestasi ilmiah.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: 3 High-Aesthetic Showcase Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Slot 1: Logo & Deklarasi */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#2b2b31] to-[#1e1e24] p-6 shadow-2xl transition-all duration-300 hover:border-[#FFB22C] hover:shadow-[0_0_25px_rgba(255,178,44,0.25)]">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFB22C]">
                  Arsip Pendirian
                </span>
                <span className="rounded-full bg-[#FFB22C]/15 px-2.5 py-0.5 text-[10px] font-extrabold text-[#FFB22C] border border-[#FFB22C]/30">
                  Est. 5 Mei 2015
                </span>
              </div>
              <div className="my-6 flex justify-center">
                <div className="relative h-36 w-full max-w-[240px]">
                  <Image
                    src="/logoperisaidengantulisan.png"
                    alt="Logo PERISAI UMI"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-contain drop-shadow-[0_8px_20px_rgba(255,178,44,0.3)] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              <h4 className="text-base font-bold text-white">Fondasi Perisai Emas UMI</h4>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Wadah independen dan inklusif yang menyatukan ide-ide riset terapan dari mahasiswa lintas fakultas.
              </p>
            </div>

            {/* Slot 2: PIMNAS & Kompetisi Ilmiah */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#2b2b31] to-[#1e1e24] p-6 shadow-2xl transition-all duration-300 hover:border-[#FFB22C] hover:shadow-[0_0_25px_rgba(255,178,44,0.25)]">
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 border border-white/10">
                <Image
                  src="/og-default.jpg"
                  alt="Kampus Riset UMI"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-md bg-[#FFB22C] px-2.5 py-1 text-[11px] font-black text-[#1b1b1f]">
                    PIMNAS & PKM
                  </span>
                  <span className="text-[11px] font-bold text-white drop-shadow">
                    Kiprah Nasional
                  </span>
                </div>
              </div>
              <h4 className="text-base font-bold text-white">Inkubator Prestasi & Medali Emas</h4>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Ratusan proposal didanai, delegasi bergengsi di kancah nasional, dan pembinaan intensif karya ilmiah mahasiswa.
              </p>
            </div>

            {/* Slot 3: Komunitas Inovator Muda */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#2b2b31] to-[#1e1e24] p-6 shadow-2xl transition-all duration-300 hover:border-[#FFB22C] hover:shadow-[0_0_25px_rgba(255,178,44,0.25)]">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 rounded-xl bg-[#1b1b1f] border border-[#FFB22C]/40 p-2 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/maskot.png"
                    alt="Maskot Inovator PERISAI"
                    width={72}
                    height={72}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FFB22C]">
                    Keluarga Besar Fungsionaris
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">Rumah Para &ldquo;Inovator&rdquo;</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Menghubungkan 42 pengurus aktif dari 8 departemen & 13 fakultas untuk berkarya bersama.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. MILESTONE TIMELINE BERSEJARAH                         */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-white/10">
        <div className="text-center mb-12">
          <span className="rounded-full bg-[#FFB22C]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FFB22C] border border-[#FFB22C]/30">
            Jejak Langkah
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-white">
            Tonggak Sejarah & Milestone
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Evolusi transformasi UKM PERISAI UMI dari masa ke masa menuju Perisai Emas.
          </p>
        </div>

        <div className="relative border-l-2 border-[#FFB22C]/60 ml-4 sm:ml-12 pl-6 sm:pl-10 space-y-10 py-4 max-w-4xl mx-auto">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              {/* Dot marker */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1 h-5 w-5 rounded-full border-4 border-[#1b1b1f] bg-[#FFB22C] shadow-[0_0_12px_rgba(255,178,44,0.8)] group-hover:scale-125 transition-transform" />

              <span className="inline-block rounded-md bg-[#FFB22C] px-3 py-1 font-mono text-xs font-black text-[#1b1b1f] mb-2 shadow-xs">
                {m.year}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-[#FFB22C] transition-colors">
                {m.title}
              </h3>
              <p className="mt-1 text-sm text-zinc-300 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FILOSOFI LAMBANG PERISAI UMI                          */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="rounded-3xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#2b2b31] via-[#222228] to-[#1b1b1f] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div
            className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ background: "#FFB22C" }}
          />
          <div className="max-w-3xl">
            <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1b1b1f]">
              Makna & Identitas
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white">
              Filosofi Lambang PERISAI UMI
            </h2>
            <div className="mt-6 space-y-4 text-sm text-zinc-300">
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-2xl">🛡️</span>
                <div>
                  <strong className="text-white block font-bold">Bentuk Perisai:</strong>
                  Melambangkan benteng integritas keilmuan, penjaga moralitas akademik, serta keteguhan dalam memegang nilai-nilai Islam.
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-2xl">📖</span>
                <div>
                  <strong className="text-white block font-bold">Buku, Pena & Simbol Riset:</strong>
                  Manifestasi gairah keilmuan, tradisi membaca (Iqra), dan dedikasi menghasilkan riset bermutu tinggi bagi peradaban.
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-2xl">✨</span>
                <div>
                  <strong className="text-white block font-bold">Aksen Emas & Hijau:</strong>
                  Menyelaraskan marwah keislaman almamater Universitas Muslim Indonesia dengan kemuliaan prestasi juara dan inovasi unggul.
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
              <p className="text-xs text-zinc-400">
                Lanjutkan membaca visi strategis dan komitmen kerja organisasi:
              </p>
              <Link
                href="/tentang/visi-misi"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFB22C] px-6 py-2.5 text-xs font-black text-[#1b1b1f] hover:bg-[#FFC85A] transition shadow-[0_0_15px_rgba(255,178,44,0.3)]"
              >
                Lanjut ke Visi, Misi & Tujuan →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
