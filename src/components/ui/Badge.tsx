import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "primary" | "secondary";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#FFB22C]/15 text-[#FFB22C] border border-[#FFB22C]/40 shadow-[0_0_12px_rgba(255,178,44,0.15)]",
    secondary: "bg-white/10 text-zinc-200 border border-white/15",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    danger: "bg-red-500/15 text-red-400 border border-red-500/30",
    info: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
    neutral: "bg-white/5 text-zinc-300 border border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
