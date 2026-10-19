import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface EditLinkProps {
  href: string;
  label?: string;
  className?: string;
}

/**
 * Tombol Link 'Ubah' standar untuk baris tabel admin panel.
 * Dirancang proporsional dan serasi dengan ConfirmDelete.
 */
export function EditLink({
  href,
  label = "Ubah",
  className,
}: EditLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#FFB22C] bg-[#FFB22C]/10 border border-[#FFB22C]/25 hover:bg-[#FFB22C]/20 hover:border-[#FFB22C]/40 hover:text-[#FFC85A] transition-all shadow-sm shrink-0",
        className
      )}
    >
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
