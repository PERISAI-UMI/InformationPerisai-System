import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "primary" | "secondary";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#E6AF2E]/15 text-[#9c7112] border border-[#E6AF2E]/30 dark:bg-[#E6AF2E]/25 dark:text-[#F5D061] dark:border-[#E6AF2E]/40",
    secondary: "bg-[#282F44]/10 text-[#282F44] border border-[#282F44]/20 dark:bg-[#282F44] dark:text-[#ECECEC] dark:border-[#3d4663]",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    danger: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
    info: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
    neutral: "bg-[#ECECEC] text-[#282F44] border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
