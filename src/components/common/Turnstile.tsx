"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

export interface TurnstileRef {
  reset: () => void;
}

export interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error?: unknown) => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  className?: string;
  id?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: (error?: unknown) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  (
    {
      onVerify,
      onExpire,
      onError,
      theme = "dark",
      size = "normal",
      className = "",
      id = "turnstile-widget",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    const reset = useCallback(() => {
      if (typeof window !== "undefined" && window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (e) {
          console.warn("[turnstile] Gagal mereset widget:", e);
        }
      }
    }, []);

    useImperativeHandle(ref, () => ({
      reset,
    }));

    useEffect(() => {
      // Jika site key tidak tersedia di lingkungan non-produksi, berikan bypass token
      if (!siteKey) {
        if (process.env.NODE_ENV !== "production") {
          onVerify("dev-bypass-turnstile-token");
        }
        return;
      }

      let isMounted = true;

      const renderWidget = () => {
        if (!isMounted || !containerRef.current || !window.turnstile) return;

        // Bersihkan widget sebelumnya jika ada
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Abaikan kesalahan remove
          }
          widgetIdRef.current = null;
        }

        try {
          const wId = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            size,
            callback: (token: string) => {
              if (isMounted) onVerify(token);
            },
            "expired-callback": () => {
              if (isMounted) onExpire?.();
            },
            "error-callback": (err: unknown) => {
              if (isMounted) onError?.(err);
            },
          });
          widgetIdRef.current = wId;
        } catch (err) {
          console.error("[turnstile] Gagal merender widget:", err);
          onError?.(err);
        }
      };

      // Pastikan script Turnstile dimuat
      if (typeof window !== "undefined" && window.turnstile) {
        renderWidget();
      } else {
        const existingScript = document.querySelector(
          `script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]`
        );

        if (!existingScript) {
          const script = document.createElement("script");
          script.src = TURNSTILE_SCRIPT_SRC;
          script.async = true;
          script.defer = true;
          script.onload = () => {
            if (isMounted) renderWidget();
          };
          script.onerror = (e) => {
            console.error("[turnstile] Gagal memuat script Turnstile:", e);
            onError?.(e);
          };
          document.head.appendChild(script);
        } else {
          // Script sudah ada di DOM, tunggu hingga window.turnstile tersedia
          const interval = setInterval(() => {
            if (window.turnstile) {
              clearInterval(interval);
              if (isMounted) renderWidget();
            }
          }, 100);

          return () => {
            clearInterval(interval);
            isMounted = false;
            if (widgetIdRef.current && window.turnstile) {
              try {
                window.turnstile.remove(widgetIdRef.current);
              } catch {}
            }
          };
        }
      }

      return () => {
        isMounted = false;
        if (widgetIdRef.current && typeof window !== "undefined" && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {}
        }
      };
    }, [siteKey, theme, size, onVerify, onExpire, onError]);

    if (!siteKey) {
      if (process.env.NODE_ENV !== "production") {
        return (
          <div className="text-[11px] text-zinc-500 italic py-1 text-center">
            [Cloudflare Turnstile Dev Mode — Kunci dilewati]
          </div>
        );
      }
      return null;
    }

    return (
      <div
        id={id}
        ref={containerRef}
        className={`flex justify-center my-3 min-h-[65px] ${className}`}
      />
    );
  }
);

Turnstile.displayName = "Turnstile";
