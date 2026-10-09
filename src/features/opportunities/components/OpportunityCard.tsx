import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { formatDateIndonesian } from "@/lib/dates";
import { getOpportunityStatusLabel } from "../status";

export interface OpportunityCardProps {
  opportunity: {
    id: string;
    title: string;
    slug: string;
    organizer?: string | null;
    description?: string | null;
    deadlineAt?: Date | string | null;
    category?: string | null;
    coverImageUrl?: string | null;
    [key: string]: unknown;
  };
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const statusInfo = getOpportunityStatusLabel(opportunity.deadlineAt);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/peluang/${opportunity.slug}`} className="block">
        <ResponsiveImage
          src={opportunity.coverImageUrl}
          alt={opportunity.title}
          aspectRatio="video"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#E6AF2E] uppercase">
              {opportunity.category || "PELUANG"}
            </span>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-zinc-900 group-hover:text-[#E6AF2E] transition dark:text-zinc-100">
            <Link href={`/peluang/${opportunity.slug}`}>{opportunity.title}</Link>
          </h3>
          <p className="mt-1 text-xs text-zinc-500">Oleh: {opportunity.organizer || "PERISAI UMI"}</p>
          <p className="mt-2 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">
            {opportunity.description || ""}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-500">
            Tenggat: {opportunity.deadlineAt ? formatDateIndonesian(opportunity.deadlineAt) : "Tanpa Batas"}
          </span>
          <Link
            href={`/peluang/${opportunity.slug}`}
            className="font-bold text-[#E6AF2E] hover:text-[#b8861b]"
          >
            Detail →
          </Link>
        </div>
      </div>
    </div>
  );
}
