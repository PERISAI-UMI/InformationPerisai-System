import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-[#202026] p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFB22C]/10 border border-[#FFB22C]/30 text-[#FFB22C] shadow-[0_0_30px_rgba(255,178,44,0.15)]">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#FFB22C] bg-[#FFB22C]/10 border border-[#FFB22C]/20 rounded-full">
            Galat 404 Admin
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Modul Panel Tidak Ditemukan
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Halaman administratif atau rekaman data yang Anda cari tidak tersedia atau URL yang Anda masukkan salah.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-5 py-2.5 text-xs font-black text-[#16161a] hover:brightness-110 transition-all shadow-lg shadow-[#FFB22C]/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Kembali ke Dasbor</span>
          </Link>
          <Link
            href="/admin/posts"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
          >
            Daftar Berita
          </Link>
        </div>
      </div>
    </div>
  );
}
