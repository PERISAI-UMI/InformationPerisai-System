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
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Ubah Departemen
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Ubah deskripsi, urutan tampilan, atau lambang departemen.
        </p>
      </div>

      <DepartmentForm
        initialData={{
          id: department.id,
          name: department.nama,
          slug: department.profile?.slug || "",
          code: department.profile?.slug?.toUpperCase() || "",
          description: department.profile?.description || "",
          orderIndex: department.profile?.sortOrder ?? 0,
        }}
      />
    </div>
  );
}
