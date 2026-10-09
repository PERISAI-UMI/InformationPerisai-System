"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-zinc-950">
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold tracking-wide text-rose-600 uppercase dark:text-rose-400">
          Terjadi Kesalahan
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Sistem Menghadapi Kendala
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
          Terjadi galat tak terduga saat memproses permintaan Anda. Silakan coba kembali atau hubungi administrator.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-5 py-2.5 text-sm font-semibold text-[#282F44] shadow-sm transition hover:bg-[#F5D061] cursor-pointer"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
