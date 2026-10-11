import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  createPageUrl: (page: number) => string;
}

export function Pagination({ currentPage, totalPages, createPageUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-3 py-6">
      <Link
        href={createPageUrl(Math.max(1, currentPage - 1))}
        className={cn(
          "rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-zinc-300 hover:border-[#FFB22C]/40 hover:text-white hover:bg-[#FFB22C]/10 transition-all",
          currentPage <= 1 && "pointer-events-none opacity-40"
        )}
      >
        ← Sebelumnya
      </Link>

      <span className="text-xs text-zinc-400">
        Halaman <strong className="text-[#FFB22C] font-bold">{currentPage}</strong> dari{" "}
        <strong className="text-white font-bold">{totalPages}</strong>
      </span>

      <Link
        href={createPageUrl(Math.min(totalPages, currentPage + 1))}
        className={cn(
          "rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-zinc-300 hover:border-[#FFB22C]/40 hover:text-white hover:bg-[#FFB22C]/10 transition-all",
          currentPage >= totalPages && "pointer-events-none opacity-40"
        )}
      >
        Selanjutnya →
      </Link>
    </nav>
  );
}
