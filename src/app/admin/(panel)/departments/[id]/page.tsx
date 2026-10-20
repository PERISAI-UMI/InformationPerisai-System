import { notFound } from "next/navigation";
import { getAdminDepartmentById } from "@/features/departments/queries.admin";
import { DepartmentForm } from "@/features/departments/components/DepartmentForm";
import { requirePermission } from "@/lib/permissions";

export default async function AdminEditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requirePermission("departments:update", { departmentId: id });
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
          name: department.name,
          slug: department.slug,
          code: department.code,
          description: department.description,
          orderIndex: department.orderIndex,
        }}
      />
    </div>
  );
}
