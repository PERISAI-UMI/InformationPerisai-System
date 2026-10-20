import { UserForm } from "@/features/users/components/UserForm";
import { requirePermission } from "@/lib/permissions";

export default async function AdminNewUserPage() {
  await requirePermission("users:create");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Buat Akun Pengguna Baru
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Tambahkan akun untuk pengurus atau editor konten portal.
        </p>
      </div>

      <UserForm />
    </div>
  );
}
