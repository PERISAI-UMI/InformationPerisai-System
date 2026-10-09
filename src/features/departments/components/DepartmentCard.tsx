import Link from "next/link";

export interface DepartmentCardProps {
  department: {
    id: string;
    name: string;
    slug: string;
    code?: string | null;
    description?: string | null;
    logoUrl?: string | null;
    _count?: {
      members?: number;
      workPrograms?: number;
    };
  };
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#2b2b31]/80 p-6 shadow-md transition-all duration-300 hover:border-[#FFB22C]/60 hover:shadow-[0_0_20px_rgba(255,178,44,0.15)]">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFB22C]/15 text-[#FFB22C] border border-[#FFB22C]/30 font-black text-sm">
            {department.code || "DEPT"}
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            {department._count?.workPrograms ?? 0} Proker
          </span>
        </div>
        <h3 className="mt-4 text-base font-bold text-white group-hover:text-[#FFB22C] transition-colors">
          <Link href="/tentang/sumber-daya#departemen">{department.name}</Link>
        </h3>
        {department.description && (
          <p className="mt-2 text-xs text-zinc-300 line-clamp-3 leading-relaxed">
            {department.description}
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-zinc-400">
          {department._count?.members ?? 0} Pengurus Aktif
        </span>
        <Link
          href="/tentang/sumber-daya#departemen"
          className="font-bold text-[#FFB22C] hover:underline"
        >
          Lihat Profil →
        </Link>
      </div>
    </div>
  );
}
