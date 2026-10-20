import { requirePermission } from "@/lib/permissions";
import Link from "next/link";
import { getEligibleUsers } from "@/features/roles/queries.server";
import { RoleForm } from "@/features/roles/components/RoleForm";

export const dynamic = "force-dynamic";

export default async function AdminNewRolePage() {
  await requirePermission("users:assign_role");
  const eligibleUsers = await getEligibleUsers();

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
          <Link href="/admin/roles" className="hover:text-white transition-colors">
            Manajemen Peran
          </Link>
          <span>/</span>
          <span className="text-[#FFB22C] font-semibold">Buat Peran Baru</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Tambah Peran & Konfigurasi Izin Baru
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Tetapkan nama peran, deskripsi tugas, matriks 38 kunci izin granular, serta alokasikan akun fungsionaris.
        </p>
      </div>

      <RoleForm eligibleUsers={eligibleUsers} />
    </div>
  );
}
