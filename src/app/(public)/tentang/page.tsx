import { getPublicActiveMembers } from "@/features/members/queries.public";
import { getPublicSettings } from "@/features/settings/queries.public";
import { OrganogramChart } from "@/features/members/components/OrganogramChart";
import { AboutNavTabs } from "@/features/about/components/AboutNavTabs";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang UKM PERISAI UMI — Profil, Sejarah, Visi, Misi & Struktur",
  description:
    "Profil lengkap, sejarah pendirian 5 Mei 2015, visi, misi, dan struktur fungsionaris UKM PERISAI Universitas Muslim Indonesia.",
};

export default async function TentangPage() {
  const [members, settings] = await Promise.all([
    getPublicActiveMembers(),
    getPublicSettings(),
  ]);

  const currentGen = settings.current_generasi || "11";
  const historyText =
    settings.history_content ||
    "PERISAI UMI merupakan Unit Kegiatan Mahasiswa (UKM) resmi Universitas Muslim Indonesia yang berfokus pada pengembangan penalaran, riset, inovasi, dan kompetisi ilmiah. UKM ini lahir sebagai respon atas meningkatnya kebutuhan mahasiswa UMI untuk memiliki wadah pembinaan yang terarah dalam karya tulis ilmiah, PKM, penelitian, dan pengembangan teknologi.";

  return (
    <div className="min-h-screen bg-[#1b1b1f] text-[#ECECEC] pb-24">
      {/* Hero Header */}
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
            className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider text-[#FFB22C]"
            style={{ textShadow: "0 4px 30px rgba(255, 178, 44, 0.45)" }}
          >
            TENTANG KAMI
          </h1>
          <p className="mt-2 text-base sm:text-xl md:text-2xl font-black uppercase tracking-widest text-white drop-shadow-md">
            PUSAT PENGEMBANGAN RISET MAHASISWA
          </p>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-medium">
            Mengenal lebih dekat ekosistem riset, tonggak sejarah, nilai filosofis, dan formasi kepengurusan UKM PERISAI UMI
          </p>

          <div className="mt-8 flex justify-center">
            <AboutNavTabs />
          </div>
        </div>
      </section>

      {/* Overview Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-16">
        {/* Sejarah Snippet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-[#FFB22C]/20 bg-[#2b2b31]/80 p-8 sm:p-12 backdrop-blur-md shadow-2xl">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-block rounded-md bg-[#FFB22C] px-3.5 py-1 text-xs font-black text-[#1b1b1f]">
              Sejarah PERISAI UMI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Wadah Riset & Inovasi Mahasiswa Sejak 2015
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {historyText}
            </p>
            <div className="pt-2">
              <Link
                href="/tentang/sejarah"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFB22C] px-5 py-2.5 text-xs font-black text-[#1b1b1f] hover:bg-[#FFC85A] transition shadow-[0_0_15px_rgba(255,178,44,0.3)]"
              >
                Baca Selengkapnya di Halaman Sejarah →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative h-44 w-full max-w-[240px]">
              <Image
                src="/logoperisaidengantulisan.png"
                alt="Logo PERISAI UMI"
                fill
                sizes="240px"
                className="object-contain drop-shadow-[0_4px_20px_rgba(255,178,44,0.35)]"
              />
            </div>
          </div>
        </div>

        {/* Visi Misi Snippet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#2b2b31] to-[#202026] p-8 shadow-xl flex flex-col justify-between">
            <div>
              <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black text-[#1b1b1f]">
                VISI PERISAI UMI
              </span>
              <p className="mt-4 text-base sm:text-lg font-bold text-white leading-relaxed">
                &ldquo;Menjadi organisasi mahasiswa yang unggul dalam riset, inovasi, dan pengembangan penalaran ilmiah untuk menciptakan generasi inovator yang kompeten, berintegritas, dan berdaya saing di tingkat nasional maupun internasional.&rdquo;
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/tentang/visi-misi"
                className="text-xs font-bold text-[#FFB22C] hover:underline"
              >
                Buka Visi, 6 Misi & 5 Sasaran Lengkap →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#2b2b31]/80 p-8 shadow-xl flex flex-col justify-between">
            <div>
              <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black text-[#1b1b1f]">
                MISI & TUJUAN UTAMA
              </span>
              <ul className="mt-4 space-y-2 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#FFB22C] font-bold">•</span>
                  <span>Mengembangkan budaya ilmiah dan pembinaan riset berkelanjutan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFB22C] font-bold">•</span>
                  <span>Mendorong partisipasi aktif kompetisi ilmiah (PKM, PIMNAS, Gemastik).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFB22C] font-bold">•</span>
                  <span>Membangun kolaborasi riset interdisipliner dan kemitraan eksternal.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/tentang/visi-misi"
                className="text-xs font-bold text-[#FFB22C] hover:underline"
              >
                Lihat Detail Misi & Tujuan →
              </Link>
            </div>
          </div>
        </div>

        {/* Struktur Fungsionaris Snippet */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black text-[#1b1b1f]">
                Generasi {currentGen} (Periode Aktif)
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
                Bagan Struktur & Fungsionaris
              </h2>
            </div>
            <Link
              href="/tentang/struktur"
              className="text-xs font-bold text-[#FFB22C] hover:underline"
            >
              Buka Halaman Struktur Organisasi Penuh →
            </Link>
          </div>

          <OrganogramChart members={members as any} />
        </div>
      </section>
    </div>
  );
}
