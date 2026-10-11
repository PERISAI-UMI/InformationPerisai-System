import { DepartmentForm } from "@/features/departments/components/DepartmentForm";

export default function AdminNewDepartmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Tambah Departemen Baru
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Daftarkan divisi atau bidang baru dalam struktur organisasi.
        </p>
      </div>

      <DepartmentForm />
    </div>
  );
}
