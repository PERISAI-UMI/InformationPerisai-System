import { requirePermission } from "@/lib/permissions.server";
import Link from "next/link";
import Image from "next/image";
import { getRoles } from "@/features/roles/queries.server";
import { RoleDeleteButton } from "@/features/roles/components/RoleDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
  await requirePermission("users:assign_role");
  const roles = await getRoles();

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Manajemen Peran & Hak Akses (RBAC)
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFB22C]/10 text-[#FFB22C] border border-[#FFB22C]/30">
              {roles.length} Peran
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Definisikan peran kustom, sesuaikan matriks hak akses 38 kunci izin granular, dan tetapkan akun pengurus organisasi.
          </p>
        </div>

        <Link
          href="/admin/roles/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-[#1b1b1f] text-xs font-extrabold shadow-lg shadow-[#FFB22C]/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Peran Baru
        </Link>
      </div>

      {/* Grid Kartu Peran */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="rounded-3xl border border-white/10 bg-[#1a1a20] p-6 space-y-5 hover:border-white/20 transition-all shadow-sm"
          >
            {/* Header Kartu */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-white tracking-wide">{role.label}</h2>
                  <span
                    className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                      role.isSystem
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {role.isSystem ? "Sistem" : "Kustom"}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#FFB22C]">{role.name}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/roles/${role.id}`}
                  className="p-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold flex items-center gap-1.5"
                  title="Edit matriks izin & anggota"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </Link>

                {!role.isSystem && (
                  <RoleDeleteButton
                    roleId={role.id}
                    roleName={role.label}
                    userCount={role.userCount}
                  />
                )}
              </div>
            </div>

            {/* Deskripsi */}
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {role.description || "Tidak ada deskripsi khusus untuk peran ini."}
            </p>

            {/* Statistik Izin & Anggota */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-300">Hak Akses:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-zinc-300 font-bold border border-white/10">
                  {role.permissions.length} Kunci Izin Aktif
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-400">Pengurus:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                  {role.userCount} Akun
                </span>
              </div>
            </div>

            {/* Avatar Pengurus yang Menggunakan Peran */}
            {role.users.length > 0 && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-[11px] text-zinc-500">Akun Terikat:</span>
                <div className="flex -space-x-2 overflow-hidden">
                  {role.users.slice(0, 6).map((u) => (
                    <div
                      key={u.idPerisai}
                      className="relative h-6 w-6 rounded-full overflow-hidden bg-zinc-800 border-2 border-[#1a1a20]"
                      title={`${u.namaLengkap} (${u.email})`}
                    >
                      {u.fotoUrl ? (
                        <Image src={u.fotoUrl} alt={u.namaLengkap} fill className="object-cover" sizes="24px" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-bold text-[9px] text-zinc-300">
                          {u.namaLengkap.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {role.users.length > 6 && (
                  <span className="text-[10px] text-zinc-500 font-medium">
                    +{role.users.length - 6} lainnya
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
