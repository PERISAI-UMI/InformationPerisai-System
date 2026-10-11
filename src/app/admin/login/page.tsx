"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Login berhasil! Mengalihkan ke panel...", { duration: 2000 });
        router.push("/admin");
        router.refresh();
      } else {
        const errorMsg = data.error || "ID/Email atau kata sandi tidak cocok.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch {
      const netMsg = "Terjadi kesalahan jaringan. Periksa koneksi Anda.";
      setError(netMsg);
      toast.error(netMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#141417] px-4 py-12 relative overflow-hidden selection:bg-[#FFB22C] selection:text-[#141417]">
      {/* Dynamic Keyframes Animation */}
      <style>{`
        @keyframes pr-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes pr-pulseGlow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(1.08); }
        }
      `}</style>

      {/* Subtle Geometric Background Pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#FFB22C 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient Celestial Glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[750px] rounded-full blur-[150px]"
          style={{
            background: "radial-gradient(circle, rgba(255,178,44,0.20) 0%, transparent 70%)",
            animation: "pr-pulseGlow 7s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-100px] -right-32 h-[450px] w-[450px] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, rgba(255,178,44,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 -left-40 -translate-y-1/2 h-[400px] w-[400px] rounded-full blur-[130px]"
          style={{
            background: "radial-gradient(circle, rgba(255,200,90,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating Sparkles Dekoratif */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-16 left-[15%] text-[#FFB22C]/70 select-none text-xl"
        style={{ animation: "pr-twinkle 3.5s ease-in-out infinite" }}
      >
        ✦
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-20 right-[15%] text-[#FFB22C]/60 select-none text-base"
        style={{ animation: "pr-twinkle 4.5s ease-in-out 1s infinite" }}
      >
        ✦
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-[12%] text-[#FFB22C]/40 select-none text-xs"
        style={{ animation: "pr-twinkle 5s ease-in-out 2s infinite" }}
      >
        ✦
      </span>

      {/* Main Glassmorphic Card Container */}
      <div className="w-full max-w-md rounded-3xl border border-[#FFB22C]/25 bg-gradient-to-b from-[#22222a]/95 via-[#1b1b22]/95 to-[#16161c]/95 p-6 sm:p-9 shadow-[0_10px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative z-10 transition-all duration-300 hover:border-[#FFB22C]/40">
        
        {/* Header Branding & Emblem */}
        <div className="text-center mb-7">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB22C]/35 bg-[#FFB22C]/10 px-3.5 py-1 text-[10px] font-bold tracking-widest uppercase text-[#FFB22C] mb-4 shadow-sm">
            <span>✦</span>
            <span>PORTAL PENGURUS INTERNAL</span>
            <span>✦</span>
          </div>

          {/* Logo with Soft Glow */}
          <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
            <Image
              src="/logoperisaidengantulisan.png"
              alt="Logo UKM PERISAI UMI"
              width={220}
              height={55}
              className="h-11 sm:h-12 w-auto mx-auto object-contain drop-shadow-[0_2px_12px_rgba(255,178,44,0.25)]"
              priority
            />
          </Link>

          <h1 className="mt-4 text-xl sm:text-2xl font-black tracking-tight text-white">
            Masuk ke Panel Pengurus
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-normal">
            Autentikasi fungsionaris & pengelola sistem UKM PERISAI UMI
          </p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="mb-6 animate-shake">
            <Alert variant="error" title="Gagal Masuk" onClose={() => setError("")}>
              {error}
            </Alert>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Field 1: ID PRN atau Email */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="identifier-input"
              className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300"
            >
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
                </svg>
                <span>ID PRN atau Email</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-normal normal-case">Wajib</span>
            </label>

            <div className="relative">
              <input
                id="identifier-input"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="Masukkan ID PRN atau email pengurus..."
                className="w-full rounded-xl border border-white/10 bg-[#16161b] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition duration-200 focus:border-[#FFB22C] focus:bg-[#1a1a21] focus:outline-none focus:ring-2 focus:ring-[#FFB22C]/30"
              />
            </div>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Contoh: <code className="text-zinc-400">PRN0238</code> atau <code className="text-zinc-400">pengurus@umi.ac.id</code>
            </p>
          </div>

          {/* Field 2: Kata Sandi dengan Toggle Show/Hide */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="password-input"
              className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300"
            >
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Kata Sandi</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-normal normal-case">Wajib</span>
            </label>

            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan kata sandi akun Anda..."
                className="w-full rounded-xl border border-white/10 bg-[#16161b] pl-3.5 pr-11 py-2.5 text-sm text-white placeholder-zinc-500 transition duration-200 focus:border-[#FFB22C] focus:bg-[#1a1a21] focus:outline-none focus:ring-2 focus:ring-[#FFB22C]/30"
              />

              {/* Tombol Lihat/Sembunyikan Kata Sandi */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#FFB22C] transition-colors p-1 rounded-md focus:outline-none"
              >
                {showPassword ? (
                  /* Icon Eye Slash (Sembunyikan) */
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  /* Icon Eye (Lihat) */
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button dengan Gradient Emas Mewah */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-6 bg-gradient-to-r from-[#FFB22C] via-[#FFC85A] to-[#FFA000] text-[#141417] font-black shadow-[0_4px_20px_rgba(255,178,44,0.3)] hover:shadow-[0_6px_25px_rgba(255,178,44,0.45)] hover:brightness-105 active:scale-[0.99] transition-all duration-200"
            isLoading={isLoading}
          >
            {isLoading ? "Memverifikasi Kredensial..." : "Masuk ke Panel Pengurus →"}
          </Button>
        </form>

        {/* Security / Encryption Notice */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
          <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
          </svg>
          <span>Sesi terenkripsi & dibatasi untuk fungsionaris resmi</span>
        </div>

        {/* Navigation Link to Public Site */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-[#FFB22C] transition-colors duration-200 group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            <span>Kembali ke Halaman Publik</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
