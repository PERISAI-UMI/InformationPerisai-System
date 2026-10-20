"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  PERMISSION_GROUPS,
  type PermissionGroup,
} from "../schema";
import { PERMISSION_KEYS, type PermissionKey } from "@/types/permissions";
import { createRoleAction, updateRoleAction } from "../actions";
import type { EligibleUser, RoleListItem } from "../queries.server";

interface RoleFormProps {
  initialData?: RoleListItem | null;
  eligibleUsers: EligibleUser[];
}

export function RoleForm({ initialData, eligibleUsers }: RoleFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const isSystem = Boolean(initialData?.isSystem);

  const [name, setName] = useState(initialData?.name || "");
  const [label, setLabel] = useState(initialData?.label || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionKey[]>(
    initialData?.permissions || []
  );
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>(
    initialData?.users.map((u) => u.idPerisai) || []
  );

  const [userSearch, setUserSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle satu izin
  const togglePermission = (key: PermissionKey) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Pilih semua izin dalam satu domain
  const selectDomain = (group: PermissionGroup) => {
    const groupKeys = group.permissions.map((p) => p.key);
    setSelectedPermissions((prev) => Array.from(new Set([...prev, ...groupKeys])));
  };

  // Kosongkan izin dalam satu domain
  const clearDomain = (group: PermissionGroup) => {
    const groupKeys = new Set(group.permissions.map((p) => p.key));
    setSelectedPermissions((prev) => prev.filter((k) => !groupKeys.has(k)));
  };

  // Pilih seluruh 38 izin sistem
  const selectAllPermissions = () => {
    setSelectedPermissions([...PERMISSION_KEYS]);
  };

  // Kosongkan seluruh izin
  const clearAllPermissions = () => {
    setSelectedPermissions([]);
  };

  // Toggle akun pengguna
  const toggleUser = (userId: string) => {
    setAssignedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Filter daftar pengguna berdasarkan nama atau email
  const filteredUsers = eligibleUsers.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.namaLengkap.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.idPerisai.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedPermissions.length === 0) {
      setError("Pilih minimal 1 izin untuk peran ini.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        label,
        description,
        permissions: selectedPermissions,
        assignedUserIds,
      };

      const res = isEditing && initialData
        ? await updateRoleAction(initialData.id, payload)
        : await createRoleAction(payload);

      if (!res.success) {
        setError(res.message || "Gagal menyimpan peran");
      } else {
        router.push("/admin/roles");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {isSystem && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <span className="font-bold block">Peran Sistem Terproteksi</span>
            <span>Nama kode peran sistem tidak dapat diubah agar tidak memicu gangguan pada logika otorisasi inti.</span>
          </div>
        </div>
      )}

      {/* Bagian 1: Informasi Utama Peran */}
      <div className="bg-[#1a1a20] rounded-3xl border border-white/10 p-6 space-y-6">
        <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#FFB22C]" />
          Informasi Utama Peran
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2">
              Kode Nama Peran (ID Peran) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isSystem}
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="Contoh: STAF_HUMAS atau KEPALA_BIRO"
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFB22C] disabled:opacity-60 disabled:cursor-not-allowed uppercase font-mono"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Format baku kode huruf kapital tanpa spasi (gunakan garis bawah `_`).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2">
              Label Tampilan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Contoh: Staf Publikasi & Media Humas"
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFB22C]"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Nama peran yang akan ditampilkan di profil pengguna dan antarmuka CMS.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2">Deskripsi Tugas & Wewenang</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan ruang lingkup wewenang dan peruntukan peran ini..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-[#FFB22C]"
          />
        </div>
      </div>

      {/* Bagian 2: Matriks Hak Akses Granular */}
      <div className="bg-[#1a1a20] rounded-3xl border border-white/10 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Matriks Hak Akses Granular (38 Kunci Izin)
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Centang hak akses yang diizinkan untuk peran ini di seluruh 11 domain sistem.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {selectedPermissions.length} dari {PERMISSION_KEYS.length} Terpilih
            </span>
            <button
              type="button"
              onClick={selectAllPermissions}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Pilih Semua
            </button>
            <button
              type="button"
              onClick={clearAllPermissions}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* 11 Domain Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PERMISSION_GROUPS.map((group) => {
            const groupKeys = group.permissions.map((p) => p.key);
            const activeInGroup = groupKeys.filter((k) => selectedPermissions.includes(k));
            const isAllGroupSelected = activeInGroup.length === groupKeys.length;

            return (
              <div
                key={group.domain}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4 hover:border-white/20 transition-colors"
              >
                {/* Domain Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {group.label}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono">
                        {activeInGroup.length}/{groupKeys.length}
                      </span>
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{group.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => (isAllGroupSelected ? clearDomain(group) : selectDomain(group))}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                    >
                      {isAllGroupSelected ? "Kosongkan" : "Pilih Semua"}
                    </button>
                  </div>
                </div>

                {/* Domain Checkbox List */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {group.permissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                          isChecked
                            ? "bg-[#FFB22C]/10 border border-[#FFB22C]/30 text-white"
                            : "bg-transparent hover:bg-white/5 text-zinc-400 border border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm.key)}
                          className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-[#FFB22C] focus:ring-0 focus:ring-offset-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-200">{perm.label}</span>
                            <span className="text-[10px] font-mono text-zinc-500">{perm.key}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{perm.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian 3: Alokasi Anggota Pengurus (User Assignment) */}
      <div className="bg-[#1a1a20] rounded-3xl border border-white/10 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Alokasi Pengurus (User Assignment)
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Pilih akun fungsionaris yang akan diberikan peran ini secara langsung.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {assignedUserIds.length} Pengurus Terpilih
            </span>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 w-48"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto no-scrollbar pr-1">
          {filteredUsers.length === 0 ? (
            <p className="text-xs text-zinc-500 col-span-full py-4 text-center">
              Tidak ada akun pengurus yang cocok dengan pencarian.
            </p>
          ) : (
            filteredUsers.map((user) => {
              const isAssigned = assignedUserIds.includes(user.idPerisai);
              return (
                <div
                  key={user.idPerisai}
                  onClick={() => toggleUser(user.idPerisai)}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer border transition-all ${
                    isAssigned
                      ? "bg-cyan-500/10 border-cyan-500/40 shadow-sm"
                      : "bg-white/[0.02] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                    {user.fotoUrl ? (
                      <Image
                        src={user.fotoUrl}
                        alt={user.namaLengkap}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-xs text-zinc-400">
                        {user.namaLengkap.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{user.namaLengkap}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-zinc-500">{user.idPerisai}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-zinc-400 font-medium">
                        Saat ini: {user.currentRole}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAssigned}
                    onChange={() => {}}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-cyan-400 focus:ring-0 shrink-0"
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
        <Link
          href="/admin/roles"
          className="px-6 py-3 rounded-2xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-[#1b1b1f] hover:opacity-95 transition-opacity disabled:opacity-50 shadow-lg shadow-[#FFB22C]/20"
        >
          {isSubmitting
            ? "Menyimpan Peran..."
            : isEditing
            ? "Simpan Perubahan Peran"
            : "Buat Peran Baru"}
        </button>
      </div>
    </form>
  );
}
