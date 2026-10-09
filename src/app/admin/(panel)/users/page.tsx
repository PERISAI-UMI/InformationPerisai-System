import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminUsers } from "@/features/users/queries.admin";
import { UserTable } from "@/features/users/components/UserTable";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Manajemen Pengguna & Hak Akses
          </h1>
          <p className="text-sm text-zinc-500">
            Khusus Super Admin: kelola akun pengurus, status aktif, dan role pengguna.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-4 py-2 text-sm font-bold text-[#282F44] shadow-sm hover:bg-[#F5D061] transition"
        >
          + Tambah Pengguna Baru
        </Link>
      </div>

      <UserTable users={users} />
    </div>
  );
}
