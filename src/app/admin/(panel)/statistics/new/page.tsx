import { StatisticForm } from "@/features/statistics/components/StatisticForm";

export default function AdminNewStatisticPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Tambah Indikator Statistik
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Masukkan metrik pencapaian atau statistik baru untuk ditampilkan di strip beranda.
        </p>
      </div>

      <StatisticForm />
    </div>
  );
}
