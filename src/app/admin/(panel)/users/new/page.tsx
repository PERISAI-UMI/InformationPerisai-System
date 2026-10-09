import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UserForm } from "@/features/users/components/UserForm";

export default async function AdminNewUserPage() {
  const session = await getSession();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Buat Akun Pengguna Baru
        </h1>
        <p className="text-sm text-zinc-500">
          Tambahkan akun untuk pengurus atau editor konten portal.
        </p>
      </div>

      <UserForm />
    </div>
  );
}
