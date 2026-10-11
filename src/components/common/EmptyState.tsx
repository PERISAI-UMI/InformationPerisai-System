import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  type?: "empty" | "error" | "search" | "filter";
  title?: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  type = "empty",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const defaults = {
    empty: {
      title: "Belum Ada Data",
      description: "Data belum tersedia saat ini. Silakan tambahkan data baru.",
      icon: (
        <svg className="w-8 h-8 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
      ring: "border-[#FFB22C]/20 bg-[#FFB22C]/10",
    },
    error: {
      title: "Gagal Memuat Data",
      description: "Terjadi kesalahan saat memproses data. Silakan coba muat ulang halaman.",
      icon: (
        <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      ring: "border-rose-500/25 bg-rose-500/10",
    },
    search: {
      title: "Pencarian Tidak Ditemukan",
      description: "Tidak ada data yang cocok dengan kata kunci yang Anda masukkan.",
      icon: (
        <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      ring: "border-sky-500/20 bg-sky-500/10",
    },
    filter: {
      title: "Tidak Ada Data Filter",
      description: "Tidak ditemukan rekaman yang cocok dengan kriteria filter saat ini.",
      icon: (
        <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      ),
      ring: "border-amber-500/20 bg-amber-500/10",
    },
  };

  const current = defaults[type];
  const displayTitle = title || current.title;
  const displayDesc = description || current.description;

  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-[#202026]/60 backdrop-blur-md p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-4 shadow-xl",
        className
      )}
    >
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl border shadow-inner transition-transform hover:scale-105",
          current.ring
        )}
      >
        {current.icon}
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base font-black text-white tracking-tight">
          {displayTitle}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          {displayDesc}
        </p>
      </div>

      {action && (
        <div className="pt-2">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-4 py-2.5 text-xs font-black text-[#16161a] shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 transition-all cursor-pointer"
            >
              <span>{action.label}</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/15 transition-all cursor-pointer"
            >
              <span>{action.label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
