import { DepartmentForm } from "@/features/departments/components/DepartmentForm";

export default function AdminNewDepartmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Tambah Departemen Baru
        </h1>
        <p className="text-sm text-zinc-500">
          Daftarkan divisi atau bidang baru dalam struktur organisasi.
        </p>
      </div>

      <DepartmentForm />
    </div>
  );
}
