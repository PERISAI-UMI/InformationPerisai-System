import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-zinc-950">
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold tracking-wide text-[#E6AF2E] uppercase">
          Galat 404
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
          Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau alamat URL salah.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-5 py-2.5 text-sm font-semibold text-[#282F44] shadow-sm transition hover:bg-[#F5D061] focus:outline-none focus:ring-2 focus:ring-[#E6AF2E] focus:ring-offset-2"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/kontak"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Hubungi Pengurus
          </Link>
        </div>
      </div>
    </div>
  );
}
