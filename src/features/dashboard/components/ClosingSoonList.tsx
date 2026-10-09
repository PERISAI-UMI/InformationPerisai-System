import Link from "next/link";
import { formatDateIndonesian, getDaysRemaining } from "@/lib/dates";

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
      <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        Tidak ada peluang lomba yang mendekati batas tenggat saat ini.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-4">
        ⏰ Segera Ditutup
      </h3>
      <div className="space-y-3">
        {opportunities.map((opp) => {
          const daysLeft = getDaysRemaining(opp.deadlineAt);

          return (
            <div
              key={opp.id}
              className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 last:pb-0 dark:border-zinc-800"
            >
              <div>
                <Link
                  href={`/admin/opportunities/${opp.id}`}
                  className="text-sm font-semibold text-zinc-900 hover:text-[#E6AF2E] dark:text-zinc-100 line-clamp-1 transition-colors"
                >
                  {opp.title}
                </Link>
                <p className="text-xs text-zinc-500">{opp.organizer}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  {daysLeft <= 0 ? "Hari ini!" : `${daysLeft} hari lagi`}
                </span>
                <p className="text-[11px] text-zinc-400 mt-0.5">
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
