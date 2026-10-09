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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#2b2b31]/80 shadow-md transition-all duration-300 hover:border-[#FFB22C]/60 hover:shadow-[0_0_20px_rgba(255,178,44,0.15)]">
      <Link href="/tentang/sumber-daya#proker" className="block overflow-hidden">
        <ResponsiveImage
          src={program.coverImageUrl}
          alt={program.name}
          aspectRatio="video"
          className="group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#FFB22C]">
              {program.department?.name || "Program Kerja"}
            </span>
            {getStatusBadge(program.status)}
          </div>
          <h3 className="mt-2 text-base font-bold text-white group-hover:text-[#FFB22C] transition-colors">
            <Link href="/tentang/sumber-daya#proker">{program.name}</Link>
          </h3>
          <p className="mt-2 text-xs text-zinc-300 line-clamp-3 leading-relaxed">
            {program.description}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-white/10">
          <Link
            href="/tentang/sumber-daya#proker"
            className="text-xs font-bold text-[#FFB22C] hover:underline"
          >
            Lihat Detail Proker →
          </Link>
        </div>
      </div>
    </div>
  );
}
