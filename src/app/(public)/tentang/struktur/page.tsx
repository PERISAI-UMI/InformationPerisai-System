import { getPublicActiveMembers } from "@/features/members/queries.public";
import { getPublicSettings } from "@/features/settings/queries.public";
import { OrgChart } from "@/features/members/components/OrgChart";
import { AboutNavTabs } from "@/features/about/components/AboutNavTabs";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struktur Organisasi — UKM PERISAI UMI",
  description: "Bagan struktur kepengurusan dan formasi pengurus aktif UKM PERISAI Universitas Muslim Indonesia.",
};

export default async function StrukturPage() {
  const [members, settings] = await Promise.all([
    getPublicActiveMembers(),
    getPublicSettings(),
  ]);

  const currentGen = settings.current_generasi || "11";

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="max-w-5xl mx-auto">
          <AboutNavTabs />
        </div>

        {/* Header Hero */}
        <div className="text-center mt-6 mb-12 max-w-3xl mx-auto">
          <span className="rounded-full bg-[#E6AF2E]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9c7112] dark:text-[#F5D061] border border-[#E6AF2E]/30">
            Formasi Kepengurusan
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-[#282F44] dark:text-zinc-100">
            Struktur Organisasi
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Generasi {currentGen} — Amanah pengabdian kepengurusan aktif UKM PERISAI UMI.
          </p>
        </div>

        {/* Bagan Organisasi Interaktif */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 mb-16">
          <OrgChart members={members as any} />
        </div>

        {/* Next Section Banner */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-[#3d4663] bg-[#282F44] p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Ingin Mengetahui Sarana & Fasilitas Riset?</h3>
            <p className="text-xs text-zinc-300 mt-1">
              Pelajari inventaris laboratorium, ruang kerja, dan repositori karya ilmiah PERISAI.
            </p>
          </div>
          <Link
            href="/tentang/sumber-daya"
            className="rounded-xl bg-[#E6AF2E] px-6 py-2.5 text-xs font-bold text-[#282F44] hover:bg-[#F5D061] transition whitespace-nowrap shadow-sm"
          >
            Lihat Sumber Daya →
          </Link>
        </div>
      </div>
    </div>
  );
}
