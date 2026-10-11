export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-xl bg-white/10" />
          <div className="h-4 w-72 rounded-lg bg-white/5" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-[#FFB22C]/20" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#202026] p-6 space-y-4">
        <div className="h-10 w-full rounded-xl bg-white/5" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-full rounded-xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}
