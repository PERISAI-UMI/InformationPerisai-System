import { OpportunityForm } from "@/features/opportunities/components/OpportunityForm";
import { requirePermission } from "@/lib/permissions";

export default async function AdminNewOpportunityPage() {
  await requirePermission("opportunities:create");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Tambah Peluang / Lomba Baru
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Publikasikan ajang kompetisi, pendanaan, atau beasiswa untuk mahasiswa.
        </p>
      </div>

      <OpportunityForm />
    </div>
  );
}
