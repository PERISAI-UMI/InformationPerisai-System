import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";

export interface WorkProgramCardProps {
  program: {
    id: string;
    name: string;
    slug: string;
    description: string;
    status: string;
    coverImageUrl?: string | null;
    department?: { name: string; code?: string | null } | null;
  };
}

export function WorkProgramCard({ program }: WorkProgramCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="success">Terlaksana</Badge>;
      case "ONGOING":
        return <Badge variant="primary">Sedang Berjalan</Badge>;
      case "PLANNED":
        return <Badge variant="warning">Direncanakan</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href="/tentang/sumber-daya#proker" className="block">
        <ResponsiveImage
          src={program.coverImageUrl}
          alt={program.name}
          aspectRatio="video"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#E6AF2E] dark:text-[#F5D061]">
              {program.department?.name || "Program Kerja"}
            </span>
            {getStatusBadge(program.status)}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-zinc-900 group-hover:text-[#E6AF2E] transition dark:text-zinc-100">
            <Link href="/tentang/sumber-daya#proker">{program.name}</Link>
          </h3>
          <p className="mt-2 text-sm text-zinc-600 line-clamp-3 dark:text-zinc-400">
            {program.description}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href="/tentang/sumber-daya#proker"
            className="text-xs font-bold text-[#E6AF2E] hover:text-[#b8861b]"
          >
            Lihat Detail Proker →
          </Link>
        </div>
      </div>
    </div>
  );
}
