import React from "react";

export interface StatCardProps {
  title: string;
  value: number | string;
  icon?: string | React.ReactNode;
  iconType?: "posts" | "programs" | "opportunities" | "inbox";
  description?: string;
}

export function StatCard({ title, value, icon, iconType, description }: StatCardProps) {
  // Render clean vector SVG icon if iconType is provided or fallback
  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;

    const type = iconType || (
      typeof icon === "string" && icon.includes("📰") ? "posts" :
      typeof icon === "string" && icon.includes("📋") ? "programs" :
      typeof icon === "string" && icon.includes("🏆") ? "opportunities" :
      typeof icon === "string" && icon.includes("✉️") ? "inbox" :
      "posts"
    );

    switch (type) {
      case "posts":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case "programs":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case "opportunities":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        );
      case "inbox":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#202026] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FFB22C]/40 hover:shadow-[0_0_30px_rgba(255,178,44,0.15)] group">
      {/* Ambient Radial Corner Glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#FFB22C]/10 blur-xl group-hover:bg-[#FFB22C]/20 transition-all duration-500" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200 transition-colors">
          {title}
        </span>
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#FFB22C]/10 border border-[#FFB22C]/30 flex items-center justify-center text-[#FFB22C] shadow-sm group-hover:scale-110 transition-transform">
          {renderIcon()}
        </div>
      </div>

      <div className="relative z-10 mt-3 sm:mt-4">
        <p className="text-2xl sm:text-4xl font-black text-white group-hover:text-[#FFB22C] transition-colors tracking-tight">
          {value}
        </p>
        {description && (
          <p className="mt-1 text-xs text-zinc-400 font-light truncate">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
