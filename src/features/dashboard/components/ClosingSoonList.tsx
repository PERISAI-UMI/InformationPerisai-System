import Link from "next/link";
import { formatDateIndonesian, getDaysRemaining } from "@/lib/dates";
import { cn } from "@/lib/utils";

export interface ClosingSoonListProps {
  opportunities: Array<{
    id: string;
    title: string;
    organizer: string;
    deadlineAt: Date | string;
  }>;
}

export function ClosingSoonList({ opportunities }: ClosingSoonListProps) {
  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#202026] p-6 text-sm text-zinc-400 shadow-xl">
        Tidak ada peluang lomba yang mendekati batas tenggat saat ini.
      </div>
    );
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#202026] p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/10">
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#FFB22C]">
          Tenggat Segera Berakhir
        </h3>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp) => {
          const daysLeft = getDaysRemaining(opp.deadlineAt);

          return (
            <div
              key={opp.id}
              className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0 gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/opportunities/${opp.id}`}
                  className="text-xs sm:text-sm font-bold text-white hover:text-[#FFB22C] line-clamp-1 transition-colors"
                >
                  {opp.title}
                </Link>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{opp.organizer}</p>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-bold border",
                    daysLeft <= 3
                      ? "bg-red-500/15 border-red-500/30 text-red-300"
                      : daysLeft <= 7
                      ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                      : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  )}
                >
                  {daysLeft <= 0 ? "Hari ini!" : `${daysLeft} hari lagi`}
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-light">
                  {formatDateIndonesian(opp.deadlineAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
