import { notFound } from "next/navigation";
import { getAdminUserById } from "@/features/users/queries.admin";
import { UserForm } from "@/features/users/components/UserForm";
import { requirePermission } from "@/lib/permissions.server";

export default async function AdminEditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("users:update");

  const { id } = await params;
  const user = await getAdminUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Ubah Akun Pengguna
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Perbarui nama, peran, atau setel ulang kata sandi akun pengguna.
        </p>
      </div>

      <UserForm
        initialData={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: (["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(user.role.toUpperCase())
            ? (user.role.toUpperCase() as "SUPER_ADMIN" | "ADMIN" | "EDITOR")
            : "EDITOR"),
          isActive: user.isActive,
        }}
      />
    </div>
  );
}
