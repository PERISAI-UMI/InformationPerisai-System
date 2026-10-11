import { getPublicOpportunities } from "@/features/opportunities/queries.public";
import { CompetitionExplorer } from "@/features/opportunities/components/CompetitionExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competition & Peluang Riset Mahasiswa — UKM PERISAI UMI",
  description:
    "Direktori informasi perlombaan karya tulis ilmiah, PKM Kemendikbudristek, PIMNAS, hibah inovasi, konferensi internasional, dan beasiswa mahasiswa berprestasi.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PeluangPage({
  searchParams,
}: {
  searchParams: Promise<{ tipe?: string; kategori?: string; cari?: string }>;
}) {
  const { tipe, kategori, cari } = await searchParams;

  const oppsData = await getPublicOpportunities({
    type: tipe,
    category: kategori,
    search: cari,
  });

  return (
    <div className="relative min-h-screen bg-[#1b1b1f] text-white selection:bg-[#FFB22C] selection:text-[#1b1b1f]">
      {/* Ambient Radial Glow Top */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-full -translate-x-1/2 blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 0%, #FFB22C 0%, transparent 70%)",
        }}
      />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b border-white/10 pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            COMPETITION &{" "}
            <span className="bg-gradient-to-r from-[#FFB22C] via-[#FFD700] to-[#FFA000] bg-clip-text text-transparent">
              PELUANG MAHASISWA
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Jembatan prestasi bagi civitas akademika untuk meraih pendanaan riset PKM, medali PIMNAS,
            kejuaraan karya tulis ilmiah nasional, serta beasiswa kepemimpinan unggulan.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <CompetitionExplorer
          initialItems={oppsData.items}
          typeCounts={oppsData.typeCounts}
        />
      </main>
    </div>
  );
}
