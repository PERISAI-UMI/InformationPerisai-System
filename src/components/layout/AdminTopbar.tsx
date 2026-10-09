import Link from "next/link";
import type { AuthUser } from "@/types";

export function AdminTopbar({ user }: { user?: AuthUser }) {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold text-[#282F44] hover:text-[#E6AF2E] dark:text-[#F5D061] flex items-center gap-1.5 transition-colors"
        >
          <span>🌐</span> Lihat Situs Publik
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {user.name}
              </p>
              <p className="text-xs text-zinc-500">
                {user.role === "SUPER_ADMIN"
                  ? "Admin Utama"
                  : user.role === "ADMIN"
                  ? "Administrator"
                  : "Editor Konten"}
              </p>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
              >
                Keluar
              </button>
            </form>
          </div>
        ) : (
          <span className="text-xs text-zinc-400">Pengurus Tamu</span>
        )}
      </div>
    </header>
  );
}
