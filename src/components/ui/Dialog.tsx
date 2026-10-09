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
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900",
          className
        )}
      >
        {title && (
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
