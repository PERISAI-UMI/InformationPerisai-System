import { getPublicOpportunities } from "@/features/opportunities/queries.public";
import { OpportunityCard } from "@/features/opportunities/components/OpportunityCard";

export default async function PeluangPage() {
  const opportunities = await getPublicOpportunities();

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E6AF2E]">
            Kompetisi, Beasiswa, & Riset
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[#282F44] dark:text-zinc-100">
            Peluang Prestasi Mahasiswa
          </h1>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Kumpulan informasi lomba ilmiah, pendanaan inovasi, seminar, dan beasiswa untuk seluruh mahasiswa.
          </p>
        </div>

        {opportunities.length === 0 ? (
          <div className="text-center text-zinc-500 py-12">
            Belum ada peluang yang terdaftar saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
