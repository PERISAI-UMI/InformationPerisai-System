import { requirePermission } from "@/lib/permissions.server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoleById, getEligibleUsers } from "@/features/roles/queries.server";
import { RoleForm } from "@/features/roles/components/RoleForm";

export const dynamic = "force-dynamic";

export default async function AdminEditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("users:assign_role");
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    notFound();
  }

  const [role, eligibleUsers] = await Promise.all([
    getRoleById(numId),
    getEligibleUsers(),
  ]);

  if (!role) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
          <Link href="/admin/roles" className="hover:text-white transition-colors">
            Manajemen Peran
          </Link>
          <span>/</span>
          <span className="text-[#FFB22C] font-semibold">{role.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Konfigurasi Peran: {role.label}
          </h1>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              role.isSystem
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            }`}
          >
            {role.isSystem ? "Peran Sistem" : "Peran Kustom"}
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Sesuaikan matriks hak akses, perbarui deskripsi tugas, dan kelola alokasi akun pengurus yang terikat pada peran ini.
        </p>
      </div>

      <RoleForm initialData={role} eligibleUsers={eligibleUsers} />
    </div>
  );
}
