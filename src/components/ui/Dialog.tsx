import React from "react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-[#202026] p-6 sm:p-8 shadow-2xl text-white",
          className
        )}
      >
        {title && (
          <h3 className="text-xl font-bold text-white tracking-tight">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
