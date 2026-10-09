import { StatisticForm } from "@/features/statistics/components/StatisticForm";

export default function AdminNewStatisticPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Tambah Indikator Statistik
        </h1>
        <p className="text-sm text-zinc-500">
          Masukkan metrik pencapaian atau statistik baru untuk ditampilkan di strip beranda.
        </p>
      </div>

      <StatisticForm />
    </div>
  );
}
