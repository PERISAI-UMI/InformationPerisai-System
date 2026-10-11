import React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps {
  variant?: "error" | "warning" | "success" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function Alert({
  variant = "info",
  title,
  children,
  onClose,
  action,
  className,
}: AlertProps) {
  const styles = {
    error: {
      wrapper: "bg-rose-500/10 border-rose-500/25 text-rose-200",
      badge: "bg-rose-500/15 border-rose-500/30 text-rose-400",
      icon: (
        <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      wrapper: "bg-[#FFB22C]/10 border-[#FFB22C]/30 text-amber-200",
      badge: "bg-[#FFB22C]/15 border-[#FFB22C]/40 text-[#FFB22C]",
      icon: (
        <svg className="w-5 h-5 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    success: {
      wrapper: "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
      badge: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    info: {
      wrapper: "bg-sky-500/10 border-sky-500/30 text-sky-200",
      badge: "bg-sky-500/15 border-sky-500/40 text-sky-400",
      icon: (
        <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const current = styles[variant];

  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex items-start gap-3.5 shadow-lg",
        current.wrapper,
        className
      )}
    >
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border", current.badge)}>
        {current.icon}
      </div>

      <div className="flex-1 min-w-0 pt-0.5 space-y-1">
        {title && (
          <h4 className="text-xs sm:text-sm font-black tracking-wide text-white">
            {title}
          </h4>
        )}
        <div className="text-xs sm:text-sm leading-relaxed opacity-95">
          {children}
        </div>
        {action && <div className="pt-2">{action}</div>}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Tutup pesan"
          className="shrink-0 rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
