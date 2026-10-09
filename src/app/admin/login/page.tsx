"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Email atau kata sandi tidak cocok.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <Image
            src="/logoperisaidengantulisan.png"
            alt="UKM PERISAI UMI"
            width={220}
            height={55}
            className="h-12 w-auto mx-auto object-contain"
            priority
          />
          <h2 className="mt-6 text-xl font-bold text-white">
            Portal Pengurus Internal
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Masuk untuk mengelola konten dan sistem UKM PERISAI UMI
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-rose-950/60 border border-rose-800/80 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Alamat Email Pengurus *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@perisai-umi.org"
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

        <div className="mt-8 pt-4 border-t border-zinc-800 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-[#F5D061] transition"
          >
            ← Kembali ke Halaman Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
