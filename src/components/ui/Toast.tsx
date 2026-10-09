import React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose?: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  const styles = {
    success: "bg-[#E6AF2E]/15 text-[#282F44] border-[#E6AF2E] font-medium dark:bg-[#E6AF2E]/20 dark:text-[#F5D061]",
    error: "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300",
    warning: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300",
    info: "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border px-4 py-3 text-sm shadow-sm transition",
        styles[type]
      )}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 font-semibold hover:opacity-75 cursor-pointer"
        >
          ✕
        </button>
      )}
    </div>
  );
}
