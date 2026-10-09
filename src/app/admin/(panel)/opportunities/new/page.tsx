import { OpportunityForm } from "@/features/opportunities/components/OpportunityForm";

export default function AdminNewOpportunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Tambah Peluang / Lomba Baru
        </h1>
        <p className="text-sm text-zinc-500">
          Publikasikan ajang kompetisi, pendanaan, atau beasiswa untuk mahasiswa.
        </p>
      </div>

      <OpportunityForm />
    </div>
  );
}
