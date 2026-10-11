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
        toast.success("Login berhasil!", { duration: 2000 });
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#141417] px-4 py-12 relative selection:bg-[#FFB22C] selection:text-[#141417]">
      {/* Soft Ambient Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[550px] rounded-full bg-[#FFB22C]/[0.06] blur-[140px]" />
      </div>

      {/* Clean Glassmorphic Card Container */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b22] p-7 sm:p-8 shadow-2xl relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <Image
              src="/logoperisaidengantulisan.png"
              alt="Logo UKM PERISAI UMI"
              width={200}
              height={50}
              className="h-11 w-auto mx-auto object-contain"
              priority
            />
          </Link>

          <h1 className="mt-4 text-xl font-bold tracking-tight text-white">
            Masuk ke Panel Pengurus
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Sistem Informasi UKM PERISAI UMI
          </p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="mb-5">
            <Alert variant="error" title="Gagal Masuk" onClose={() => setError("")}>
              {error}
            </Alert>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: ID PRN atau Email */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="identifier-input"
              className="block text-xs font-semibold text-zinc-300"
            >
              ID PRN atau Email
            </label>
            <input
              id="identifier-input"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="Masukkan ID PRN atau email..."
              className="w-full rounded-xl border border-white/10 bg-[#141418] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition duration-150 focus:border-[#FFB22C] focus:outline-none focus:ring-1 focus:ring-[#FFB22C]"
            />
          </div>

          {/* Field 2: Kata Sandi */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="password-input"
              className="block text-xs font-semibold text-zinc-300"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan kata sandi..."
                className="w-full rounded-xl border border-white/10 bg-[#141418] pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 transition duration-150 focus:border-[#FFB22C] focus:outline-none focus:ring-1 focus:ring-[#FFB22C]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button (Clean & Simpel, Tanpa Tanda Panah) */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-6 bg-[#FFB22C] text-[#141417] font-bold hover:bg-[#ffa71a] transition duration-150"
            isLoading={isLoading}
          >
            {isLoading ? "Memverifikasi..." : "Masuk ke Panel Pengurus"}
          </Button>
        </form>

        {/* Navigation Link (Tanpa Tanda Panah) */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-white transition-colors duration-150"
          >
            Kembali ke Halaman Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
