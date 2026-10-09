import { notFound } from "next/navigation";
import { getAdminDepartmentById } from "@/features/departments/queries.admin";
import { DepartmentForm } from "@/features/departments/components/DepartmentForm";

export default async function AdminEditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const department = await getAdminDepartmentById(id);

  if (!department) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Ubah Departemen
        </h1>
        <p className="text-sm text-zinc-500">
          Ubah deskripsi, urutan tampilan, atau lambang departemen.
        </p>
      </div>

      <DepartmentForm
        initialData={{
          id: department.id,
          name: department.nama,
        }}
      />
    </div>
  );
}
