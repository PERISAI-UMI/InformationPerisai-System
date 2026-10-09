import { MemberCard } from "./MemberCard";

export interface OrgChartProps {
  members: Array<{
    id: string;
    name: string;
    nim?: string | null;
    faculty?: string | null;
    roleOrTitle: string;
    avatarUrl?: string | null;
    department?: { name: string; code?: string | null } | null;
  }>;
}

export function OrgChart({ members = [] }: OrgChartProps) {
  if (!members || members.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
        Belum ada data pengurus aktif untuk periode ini.
      </div>
    );
  }

  // Pisahkan Badan Pengurus Harian (BPH) dan Anggota Departemen
  const bphMembers = members.filter((m) => {
    const role = (m.roleOrTitle || "").toLowerCase();
    return (
      role.includes("ketua") ||
      role.includes("sekretaris") ||
      role.includes("bendahara")
    );
  });

  const deptMembers = members.filter((m) => !bphMembers.includes(m));

  return (
    <div className="space-y-12">
      {/* Tier 1: Badan Pengurus Harian (BPH) */}
      <div>
        <div className="text-center mb-6">
          <span className="rounded-full bg-[#E6AF2E]/15 px-3 py-1 text-xs font-bold text-[#282F44] border border-[#E6AF2E]/30 dark:bg-[#E6AF2E]/25 dark:text-[#F5D061]">
            Inti Pimpinan
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Badan Pengurus Harian (BPH)
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {bphMembers.map((m) => (
            <div key={m.id} className="w-56">
              <MemberCard member={m} />
            </div>
          ))}
        </div>
      </div>

      {/* Tier 2: Koordinator & Anggota Bidang / Departemen */}
      {deptMembers.length > 0 && (
        <div>
          <div className="text-center mb-6">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              Pengurus Bidang
            </span>
            <h3 className="mt-2 text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Departemen & Divisi
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deptMembers.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
