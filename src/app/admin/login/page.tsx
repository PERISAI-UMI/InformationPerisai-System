"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Login berhasil! Mengalihkan ke panel...", { duration: 2000 });
        router.push("/admin");
        router.refresh();
      } else {
        const errorMsg = data.error || "Email atau kata sandi tidak cocok.";
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
    <div className="min-h-screen flex items-center justify-center bg-[#16161a] px-4 py-12 relative overflow-hidden selection:bg-[#FFB22C] selection:text-[#16161a]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#FFB22C]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#FFB22C]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#202026]/90 p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <Image
            src="/logoperisaidengantulisan.png"
            alt="UKM PERISAI UMI"
            width={220}
            height={55}
            className="h-12 w-auto mx-auto object-contain"
            priority
          />
          <h2 className="mt-6 text-xl font-bold tracking-tight text-white">
            Portal Pengurus Internal
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Masuk untuk mengelola konten dan sistem UKM PERISAI UMI
          </p>
        </div>

        {error && (
          <div className="mb-6 animate-shake">
            <Alert variant="error" title="Gagal Masuk" onClose={() => setError("")}>
              {error}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="ID PRN atau Alamat Email Pengurus *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="PRN0238 atau admin@perisai-umi.org"
          />

          <Input
            type="password"
            label="Kata Sandi *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-6"
            isLoading={isLoading}
          >
            Masuk ke Panel Pengurus
          </Button>
        </form>

        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-[#FFB22C] transition-colors"
          >
            ← Kembali ke Halaman Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
