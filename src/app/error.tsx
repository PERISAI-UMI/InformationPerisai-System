"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
    // Auto-reload jika terjadi ChunkLoadError akibat deployment rilis baru
    if (
      typeof window !== "undefined" &&
      (error.name === "ChunkLoadError" || error.message?.includes("Loading chunk"))
    ) {
      const reloadKey = "chunk_failed_reload";
      const hasReloaded = sessionStorage.getItem(reloadKey);
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, "true");
        window.location.reload();
      }
    }
  }, [error]);

  const handleReset = () => {
    if (error.name === "ChunkLoadError" || error.message?.includes("Loading chunk")) {
      window.location.reload();
    } else {
      reset();
    }
  };

  const handleCopy = () => {
    const errorText = `PERISAI UMI Error Log:\nMessage: ${error.message}\nDigest: ${error.digest || "-"}\nStack: ${error.stack || "-"}`;
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#16161a] text-white selection:bg-[#FFB22C] selection:text-[#16161a] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-rose-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] rounded-full bg-[#FFB22C]/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-[#16161a]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logoperisaii.webp"
              alt="UKM PERISAI UMI"
              width={34}
              height={34}
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="font-extrabold text-sm tracking-wide text-white block leading-tight">
                UKM PERISAI UMI
              </span>
              <span className="text-[10px] uppercase font-bold text-[#FFB22C] tracking-wider block">
                Pusat Riset & Inovasi
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-zinc-300 hover:text-white transition-colors"
          >
            ← Beranda Utama
          </Link>
        </div>
      </header>

      {/* Main Error Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-16 px-6">
        <div className="max-w-xl w-full text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.2)]">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-300">
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
              <span>GALAT SISTEM TERDETEKSI</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Sistem Mengalami Kendala
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Terjadi galat tak terduga saat memproses halaman ini. Data Anda aman dan sistem telah mencatat laporan kejadian ini.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-6 py-3.5 text-xs sm:text-sm font-extrabold text-[#16161a] shadow-xl shadow-[#FFB22C]/20 hover:brightness-110 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Coba Muat Ulang</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-bold text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer shadow-lg"
            >
              Kembali ke Beranda
            </Link>
          </div>

          {/* Technical Diagnostic Accordion */}
          <div className="pt-4 border-t border-white/10 text-left">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition py-2 cursor-pointer"
            >
              <span>Rincian Diagnostik Teknis (Untuk Pengembang)</span>
              <span>{showDetails ? "▲ Sembunyikan" : "▼ Tampilkan"}</span>
            </button>

            {showDetails && (
              <div className="mt-3 rounded-2xl border border-white/10 bg-[#202026] p-4 space-y-3 animate-in fade-in">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pesan Galat:</span>
                  <p className="font-mono text-xs text-rose-300 break-words bg-black/40 p-2.5 rounded-xl border border-white/5">
                    {error.message || "Unknown error"}
                  </p>
                </div>

                {error.digest && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Kode Digest ID:</span>
                    <p className="font-mono text-xs text-amber-300 bg-black/40 p-2 rounded-lg border border-white/5">
                      {error.digest}
                    </p>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-emerald-400">Rincian Disalin!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Salin Log Galat</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-5 text-center text-xs text-zinc-500">
        UKM PERISAI UMI • Pusat Riset & Inovasi Mahasiswa
      </footer>
    </div>
  );
}
