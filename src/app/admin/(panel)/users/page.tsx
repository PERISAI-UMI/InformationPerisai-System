import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminUsers } from "@/features/users/queries.admin";
import { UserTable } from "@/features/users/components/UserTable";

import { Pagination } from "@/components/common/Pagination";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminUsers({ page, pageSize: 8 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Manajemen Pengguna & Hak Akses
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Khusus Super Admin: kelola akun pengurus, status aktif, dan role pengguna.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-4 py-2.5 text-sm font-bold text-[#16161a] shadow-lg shadow-[#FFB22C]/10 hover:from-[#FFA000] hover:to-[#FF8F00] transition"
        >
          + Tambah Pengguna Baru
        </Link>
      </div>

      <UserTable users={data.items} />

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        createPageUrl={(p) => `/admin/users?page=${p}`}
      />
    </div>
  );
}
