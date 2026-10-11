"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showStack, setShowStack] = useState(false);

  useEffect(() => {
    console.error("Admin Panel Error caught by ErrorBoundary:", error);
  }, [error]);

  const handleRetry = () => {
    setIsRetrying(true);
    try {
      reset();
    } finally {
      setTimeout(() => setIsRetrying(false), 1200);
    }
  };

  const handleCopy = () => {
    const errorText = `Admin Panel Error Log:\nName: ${error.name}\nMessage: ${error.message}\nDigest: ${error.digest || "-"}\nStack:\n${error.stack || "-"}`;
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isNetworkOrDb =
    error.message?.includes("connect") ||
    error.message?.includes("fetch") ||
    error.message?.includes("UND_ERR") ||
    error.message?.includes("PrismaClient");

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-xl w-full rounded-3xl border border-rose-500/25 bg-[#202026] p-7 sm:p-9 shadow-2xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
                {isNetworkOrDb ? "Kendala Koneksi / Basis Data" : "Galat Panel Admin"}
              </span>
              {error.digest && (
                <span className="text-[10px] text-zinc-500 font-mono">
                  #{error.digest}
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Gagal Memuat Modul Administrasi
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isNetworkOrDb
                ? "Terjadi gangguan saat menghubungkan sistem ke basis data atau server lokal. Pastikan koneksi server aktif lalu coba muat ulang."
                : "Terjadi kesalahan internal saat merender komponen panel ini. Anda dapat mencoba memuat ulang atau kembali ke dasbor."}
            </p>
          </div>
        </div>

        {/* Error Message Box */}
        {error?.message && (
          <div className="rounded-2xl bg-black/50 border border-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Laporan Teknis:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-semibold text-[#FFB22C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copied ? "✓ Tersalin!" : "Salin Log"}
              </button>
            </div>
            <p className="font-mono text-xs text-rose-300 break-words leading-relaxed">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              onClick={handleRetry}
              variant="primary"
              size="md"
              isLoading={isRetrying}
              className="w-full sm:w-auto font-black"
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Coba Muat Ulang
            </Button>
            <Link
              href="/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-all text-center"
            >
              Ke Dasbor
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setShowStack(!showStack)}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
          >
            {showStack ? "Sembunyikan Jejak Stack" : "Lihat Jejak Stack"}
          </button>
        </div>

        {/* Stack Trace Collapsible */}
        {showStack && error.stack && (
          <div className="mt-3 rounded-xl bg-black/60 border border-white/10 p-3 max-h-48 overflow-y-auto font-mono text-[10px] text-zinc-400 whitespace-pre leading-normal">
            {error.stack}
          </div>
        )}
      </div>
    </div>
  );
}
