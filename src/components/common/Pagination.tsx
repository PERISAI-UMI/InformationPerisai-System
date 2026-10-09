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
    <nav className="flex items-center justify-center gap-2 py-6">
      <Link
        href={createPageUrl(Math.max(1, currentPage - 1))}
        className={cn(
          "rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800",
          currentPage <= 1 && "pointer-events-none opacity-40"
        )}
      >
        ← Sebelumnya
      </Link>

      <span className="text-xs text-zinc-500">
        Halaman <strong className="text-zinc-900 dark:text-zinc-100">{currentPage}</strong> dari{" "}
        <strong className="text-zinc-900 dark:text-zinc-100">{totalPages}</strong>
      </span>

      <Link
        href={createPageUrl(Math.min(totalPages, currentPage + 1))}
        className={cn(
          "rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800",
          currentPage >= totalPages && "pointer-events-none opacity-40"
        )}
      >
        Selanjutnya →
      </Link>
    </nav>
  );
}
