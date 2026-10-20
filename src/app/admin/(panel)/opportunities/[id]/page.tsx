import { notFound } from "next/navigation";
import { getAdminOpportunityById } from "@/features/opportunities/queries.admin";
import { OpportunityForm } from "@/features/opportunities/components/OpportunityForm";
import { requirePermission } from "@/lib/permissions.server";

export default async function AdminEditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("opportunities:update");
  const { id } = await params;
  const opp = await getAdminOpportunityById(id);

  if (!opp) {
    notFound();
  }

  const initialData = {
    id: opp.id,
    title: opp.title,
    slug: opp.slug,
    organizer: opp.organizer || "PERISAI UMI",
    description: opp.description || "",
    requirements: null,
    linkUrl: opp.registrationUrl || "",
    deadlineAt: opp.deadlineAt
      ? new Date(opp.deadlineAt * 1000).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    category: (["LOMBA", "BEASISWA", "SEMINAR", "MAGANG"].includes((opp.category || "").toUpperCase())
      ? ((opp.category || "").toUpperCase() as "LOMBA" | "BEASISWA" | "SEMINAR" | "MAGANG")
      : "LOMBA"),
    coverImageUrl: opp.posterMediaId || null,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Ubah Peluang Lomba
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Perbarui rincian, perpanjang batas tenggat, atau tautan pendaftaran.
        </p>
      </div>

      <OpportunityForm initialData={initialData} />
    </div>
  );
}
