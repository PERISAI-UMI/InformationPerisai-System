export interface StatisticStripProps {
  statistics: Array<{
    id: string;
    label: string;
    value: number | string;
    suffix?: string | null;
    icon?: string | null;
  }>;
}

export function StatisticStrip({ statistics }: StatisticStripProps) {
  if (!statistics || statistics.length === 0) return null;

  return (
    <section className="border-y border-[#3d4663] bg-[#282F44] text-white py-14 shadow-inner">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statistics.map((s) => (
            <div key={s.id} className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F5D061]">
                {s.value}
                {s.suffix || ""}
              </span>
              <span className="mt-2 text-xs sm:text-sm font-medium text-[#ECECEC]/90 uppercase tracking-wider">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
