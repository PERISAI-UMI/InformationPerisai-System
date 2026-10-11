"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  id?: string;
  title?: string;
  message: React.ReactNode;
  type?: ToastType;
  duration?: number; // ms, default 4500
  action?: {
    label: string;
    onClick: () => void;
  };
  pushToBrowser?: boolean; // trigger browser Notification if granted
}

export interface ToastItem extends ToastOptions {
  id: string;
  createdAt: number;
}

// Global event bus for non-react or outside-tree calls
type ToastListener = (toast: ToastOptions) => void;
type DismissListener = (id?: string) => void;

const listeners = new Set<ToastListener>();
const dismissListeners = new Set<DismissListener>();

export const toast = {
  show: (options: ToastOptions) => {
    listeners.forEach((listener) => listener(options));
  },
  success: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type">) => {
    toast.show({
      ...options,
      message,
      type: "success",
      title: options?.title || "Berhasil",
    });
  },
  error: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type">) => {
    toast.show({
      ...options,
      message,
      type: "error",
      title: options?.title || "Terjadi Kendala",
    });
  },
  warning: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type">) => {
    toast.show({
      ...options,
      message,
      type: "warning",
      title: options?.title || "Peringatan",
    });
  },
  info: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type">) => {
    toast.show({
      ...options,
      message,
      type: "info",
      title: options?.title || "Informasi",
    });
  },
  dismiss: (id?: string) => {
    dismissListeners.forEach((listener) => listener(id));
  },
};

const ToastContext = createContext<{
  toasts: ToastItem[];
  addToast: (toast: ToastOptions) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  clearToasts: () => {},
});

export function useToast() {
  const context = useContext(ToastContext);
  return {
    ...context,
    toast,
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (newToast: ToastOptions) => {
      const id = newToast.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const item: ToastItem = {
        ...newToast,
        id,
        createdAt: Date.now(),
        duration: newToast.duration ?? 4500,
        type: newToast.type ?? "info",
      };

      setToasts((prev) => [item, ...prev.slice(0, 4)]); // Keep maximum 5 items

      // Dispatch browser push notification if permitted and requested
      if (
        newToast.pushToBrowser &&
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          const bodyText =
            typeof newToast.message === "string"
              ? newToast.message
              : "Pemberitahuan baru dari Sistem PERISAI";
          new Notification(newToast.title || "UKM PERISAI UMI", {
            body: bodyText,
            icon: "/logoperisaii.png",
          });
        } catch {
          // Ignore browser push failure
        }
      }
    },
    []
  );

  useEffect(() => {
    const handleAdd: ToastListener = (opts) => addToast(opts);
    const handleDismiss: DismissListener = (id) => {
      if (id) {
        removeToast(id);
      } else {
        clearToasts();
      }
    };

    listeners.add(handleAdd);
    dismissListeners.add(handleDismiss);

    return () => {
      listeners.delete(handleAdd);
      dismissListeners.delete(handleDismiss);
    };
  }, [addToast, removeToast, clearToasts]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Pemberitahuan Sistem"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex max-w-md w-full flex-col gap-3 pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} toast={item} onDismiss={() => onDismiss(item.id)} />
      ))}
    </aside>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [remaining, setRemaining] = useState(toast.duration || 4500);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = toast.duration ?? 4500;

  useEffect(() => {
    if (duration <= 0) return; // Persistent

    if (!isPaused) {
      const interval = 100;
      timerRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= interval) {
            clearInterval(timerRef.current!);
            onDismiss();
            return 0;
          }
          return prev - interval;
        });
      }, interval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, duration, onDismiss]);

  const typeConfig = {
    success: {
      border: "border-emerald-500/40",
      glow: "shadow-[0_0_25px_rgba(16,185,129,0.2)]",
      badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      progressBg: "bg-emerald-500",
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      border: "border-rose-500/40",
      glow: "shadow-[0_0_25px_rgba(244,63,94,0.25)]",
      badgeBg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
      progressBg: "bg-rose-500",
      icon: (
        <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    warning: {
      border: "border-[#FFB22C]/40",
      glow: "shadow-[0_0_25px_rgba(255,178,44,0.2)]",
      badgeBg: "bg-[#FFB22C]/15 border-[#FFB22C]/30 text-[#FFB22C]",
      progressBg: "bg-[#FFB22C]",
      icon: (
        <svg className="w-5 h-5 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      border: "border-sky-500/40",
      glow: "shadow-[0_0_25px_rgba(56,189,248,0.2)]",
      badgeBg: "bg-sky-500/15 border-sky-500/30 text-sky-400",
      progressBg: "bg-sky-500",
      icon: (
        <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const currentType = typeConfig[toast.type || "info"];
  const progressPercent = duration > 0 ? (remaining / duration) * 100 : 0;

  return (
    <div
      role="status"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-2xl bg-[#1e1e24]/95 backdrop-blur-xl border p-4 shadow-2xl transition-all duration-300 animate-toast-in",
        currentType.border,
        currentType.glow
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-inner",
            currentType.badgeBg
          )}
        >
          {currentType.icon}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          {toast.title && (
            <h5 className="text-xs font-black tracking-wide text-white mb-0.5">
              {toast.title}
            </h5>
          )}
          <div className="text-xs text-zinc-300 leading-relaxed break-words font-medium">
            {toast.message}
          </div>

          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                onDismiss();
              }}
              className="mt-2.5 inline-flex items-center text-xs font-extrabold text-[#FFB22C] hover:text-[#FFC85A] hover:underline cursor-pointer"
            >
              {toast.action.label} →
            </button>
          )}
        </div>

        <button
          onClick={onDismiss}
          aria-label="Tutup notifikasi"
          className="shrink-0 rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div
            className={cn("h-full transition-all duration-100 ease-linear", currentType.progressBg)}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
