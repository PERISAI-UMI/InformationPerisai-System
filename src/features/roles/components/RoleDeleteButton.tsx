"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteRoleAction } from "../actions";

export function RoleDeleteButton({
  roleId,
  roleName,
  userCount,
}: {
  roleId: number;
  roleName: string;
  userCount: number;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (userCount > 0) {
      alert(
        `Peran "${roleName}" tidak dapat dihapus karena masih digunakan oleh ${userCount} akun pengurus. Harap pindahkan akun tersebut ke peran lain terlebih dahulu.`
      );
      return;
    }

    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus peran kustom "${roleName}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const res = await deleteRoleAction(roleId);
      if (!res.success) {
        setError(res.message || "Gagal menghapus peran");
        alert(res.message || "Gagal menghapus peran");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan jaringan.";
      setError(msg);
      alert(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting || userCount > 0}
      title={
        userCount > 0
          ? "Tidak dapat dihapus karena masih ada akun terikat"
          : "Hapus peran kustom"
      }
      className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${
        userCount > 0
          ? "border-white/5 text-zinc-600 cursor-not-allowed bg-white/[0.02]"
          : "border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50"
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      {isDeleting ? "Menghapus..." : "Hapus"}
    </button>
  );
}
