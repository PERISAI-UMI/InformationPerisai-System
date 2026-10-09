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
    <div className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-xs transition hover:border-[#E6AF2E] hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E6AF2E]/15 text-[#282F44] border border-[#E6AF2E]/30 font-bold text-sm dark:bg-[#E6AF2E]/20 dark:text-[#F5D061]">
            {department.code || "DEPT"}
          </div>
          <span className="text-xs text-zinc-500">
            {department._count?.workPrograms ?? 0} Proker
          </span>
        </div>
        <h3 className="mt-4 text-lg font-bold text-zinc-900 group-hover:text-[#E6AF2E] transition dark:text-zinc-100">
          <Link href="/tentang/sumber-daya#departemen">{department.name}</Link>
        </h3>
        {department.description && (
          <p className="mt-2 text-sm text-zinc-600 line-clamp-3 dark:text-zinc-400">
            {department.description}
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
        <span className="text-zinc-500">
          {department._count?.members ?? 0} Pengurus Aktif
        </span>
        <Link
          href="/tentang/sumber-daya#departemen"
          className="font-bold text-[#E6AF2E] hover:text-[#b8861b]"
        >
          Lihat Profil →
        </Link>
      </div>
    </div>
  );
}
