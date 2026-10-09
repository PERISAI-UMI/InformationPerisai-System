import { PeriodForm } from "@/features/periods/components/PeriodForm";

export default function AdminNewPeriodPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Tambah Periode Kepengurusan
        </h1>
        <p className="text-sm text-zinc-500">
          Buat periode masa bakti baru untuk kepengurusan UKM PERISAI UMI.
        </p>
      </div>

      <PeriodForm />
    </div>
  );
}
