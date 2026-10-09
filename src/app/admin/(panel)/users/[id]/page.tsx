import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminUserById } from "@/features/users/queries.admin";
import { UserForm } from "@/features/users/components/UserForm";

export default async function AdminEditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const { id } = await params;
  const user = await getAdminUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Ubah Akun Pengguna
        </h1>
        <p className="text-sm text-zinc-500">
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
