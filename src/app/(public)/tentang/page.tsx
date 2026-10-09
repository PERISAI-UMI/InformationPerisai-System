import { getPublicActiveMembers } from "@/features/members/queries.public";
import { getPublicSettings } from "@/features/settings/queries.public";
import { OrgChart } from "@/features/members/components/OrgChart";
import { AboutNavTabs } from "@/features/about/components/AboutNavTabs";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang UKM PERISAI UMI — Profil, Visi, Misi & Struktur",
  description: "Profil lengkap, sejarah pendirian 5 Mei 2015, visi, misi, dan struktur kepengurusan UKM PERISAI Universitas Muslim Indonesia.",
};

export default async function TentangPage() {
  const [members, settings] = await Promise.all([
    getPublicActiveMembers(),
    getPublicSettings(),
  ]);

  const currentGen = settings.current_generasi || "11";
  const historyText =
    settings.history_content ||
    "Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia (UKM PERISAI UMI) adalah unit kegiatan mahasiswa tingkat universitas yang didirikan pada tanggal 5 Mei 2015 di Makassar, Sulawesi Selatan.";

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Navigation Tabs to Subpages */}
        <div className="max-w-5xl mx-auto">
          <AboutNavTabs />
        </div>

        {/* Header Profil & Sejarah */}
        <div id="sejarah" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 text-center lg:text-left">
            <span className="rounded-full bg-[#E6AF2E]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#9c7112] dark:text-[#F5D061] border border-[#E6AF2E]/30">
              Profil Lembaga
            </span>
            <h1 className="mt-3 text-3xl sm:text-5xl font-black text-[#282F44] dark:text-zinc-100">
              Tentang UKM PERISAI UMI
            </h1>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {historyText}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href="/tentang/sejarah"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E6AF2E] px-4 py-2 text-xs font-bold text-[#282F44] hover:bg-[#F5D061] transition shadow-xs"
              >
                Baca Lengkap Sejarah & Milestone →
              </Link>
            </div>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <Image
              src="/logoperisaidengantulisan.png"
              alt="Logo PERISAI UMI"
              width={260}
              height={160}
              className="h-auto max-h-48 w-auto object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Visi & Misi */}
        <div id="visi-misi" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E6AF2E]">
                Landasan Kerja
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#282F44] dark:text-zinc-100">
                Visi & Misi Organisasi
              </h2>
            </div>
            <Link
              href="/tentang/visi-misi"
              className="text-xs font-bold text-[#E6AF2E] hover:underline"
            >
              Lihat Tujuan Strategis Lengkap →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-[#E6AF2E]/30 bg-[#E6AF2E]/10 p-8 dark:border-[#E6AF2E]/20 dark:bg-[#E6AF2E]/10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#282F44] dark:text-[#F5D061]">
                  🎯 Visi Organisasi
                </h3>
                <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Menjadi pusat riset, penalaran, dan inovasi mahasiswa terdepan yang berlandaskan nilai-nilai keislaman serta berdaya saing di kancah nasional maupun internasional.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6AF2E]/20">
                <Link
                  href="/tentang/visi-misi"
                  className="text-xs font-bold text-[#9c7112] dark:text-[#F5D061] hover:underline"
                >
                  Detail Visi & 5 Pilar Capaian →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#282F44] dark:text-zinc-100">
                  🚀 Misi Organisasi
                </h3>
                <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  1. Mewadahi dan memfasilitasi mahasiswa UMI dalam kegiatan riset dan kepenulisan ilmiah.
                  <br />
                  2. Mengakselerasi partisipasi mahasiswa pada PKM, P2MW, PPK Ormawa, dan Gemastik.
                  <br />
                  3. Membangun kolaborasi riset interdisipliner dengan institusi dan industri.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                  href="/tentang/visi-misi"
                  className="text-xs font-bold text-[#282F44] dark:text-[#F5D061] hover:underline"
                >
                  Baca 4 Misi Operasional →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Struktur Pengurus */}
        <div id="struktur" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E6AF2E]">
                Generasi {currentGen} (Periode Berjalan)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#282F44] dark:text-zinc-100">
                Struktur Kepengurusan
              </h2>
            </div>
            <Link
              href="/tentang/struktur"
              className="text-xs font-bold text-[#E6AF2E] hover:underline"
            >
              Buka Halaman Struktur Lengkap →
            </Link>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <OrgChart members={members as any} />
          </div>
        </div>

        {/* Sumber Daya Section */}
        <div id="sumber-daya" className="rounded-3xl border border-[#3d4663] bg-[#282F44] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="rounded-md bg-[#E6AF2E] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#282F44]">
              Sarana Riset
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Sumber Daya & Fasilitas Riset
            </h2>
            <p className="mt-2 text-sm text-zinc-300 max-w-xl leading-relaxed">
              Didukung oleh fasilitas sekretariat Menara UMI, workstation komputasi data, repositori 100+ naskah ilmiah lolos pendanaan, serta jejaring pembimbing pakar.
            </p>
          </div>
          <Link
            href="/tentang/sumber-daya"
            className="rounded-xl bg-[#E6AF2E] px-6 py-3 text-xs font-bold text-[#282F44] hover:bg-[#F5D061] transition whitespace-nowrap shadow-sm"
          >
            Jelajahi Sumber Daya →
          </Link>
        </div>
      </div>
    </div>
  );
}
