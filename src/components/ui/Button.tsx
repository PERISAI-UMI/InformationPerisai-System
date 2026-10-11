import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1b1b1f] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-[#1b1b1f] font-extrabold shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 hover:shadow-[#FFB22C]/35 focus:ring-[#FFB22C]",
      secondary:
        "bg-white/10 text-white hover:bg-white/15 border border-white/10 focus:ring-white/20",
      outline:
        "border border-white/15 bg-white/5 text-zinc-200 hover:border-[#FFB22C] hover:text-[#FFB22C] hover:bg-[#FFB22C]/10 focus:ring-[#FFB22C]",
      danger:
        "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 focus:ring-red-500",
      ghost:
        "text-zinc-300 hover:text-white hover:bg-white/5 focus:ring-white/10",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-5 py-2.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
