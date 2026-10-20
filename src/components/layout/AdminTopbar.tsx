import Link from "next/link";
import type { AuthUser } from "@/types";
import { AdminNotificationBell } from "./AdminNotificationBell";

export function AdminTopbar({ user }: { user?: AuthUser }) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "P";

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#1a1a20]/90 backdrop-blur-xl px-5 sm:px-8 z-20">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-[#FFB22C]/40 hover:text-[#FFB22C] hover:bg-[#FFB22C]/10 transition-all"
        >
          <svg className="h-4 w-4 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span className="hidden sm:inline">Kunjungi</span> Website Publik
          <span className="text-zinc-500 text-[10px]">↗</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <AdminNotificationBell />
        {user ? (
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#FFB22C]/15 border border-[#FFB22C]/40 flex items-center justify-center text-xs font-black text-[#FFB22C] shadow-sm">
                {initial}
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {user.role === "SUPER_ADMIN"
                    ? "Super Admin Utama"
                    : user.role === "ADMIN"
                    ? "Pengurus Inti & Kadep"
                    : "Editor Konten"}
                </p>
              </div>
            </div>

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-950/60 hover:border-red-500/50 transition-all cursor-pointer"
              >
                <span>Keluar</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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
