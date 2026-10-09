export interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  description?: string;
}

export function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {title}
        </span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-zinc-400">{description}</p>
      )}
    </div>
  );
}
