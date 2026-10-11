import { PeriodForm } from "@/features/periods/components/PeriodForm";

export default function AdminNewPeriodPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Tambah Periode Kepengurusan
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Buat periode masa bakti baru untuk kepengurusan UKM PERISAI UMI.
        </p>
      </div>

      <PeriodForm />
    </div>
  );
}
