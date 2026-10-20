"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const quickLinks = [
    {
      title: "Kabar & Artikel Riset",
      desc: "Rilis pers, publikasi karya ilmiah, dan berita kegiatan terbaru.",
      href: "/kabar",
      icon: (
        <svg className="w-5 h-5 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      title: "Peluang & Lomba Prestasi",
      desc: "Informasi kompetisi ilmiah, call for papers, dan hibah mahasiswa.",
      href: "/peluang",
      icon: (
        <svg className="w-5 h-5 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      ),
    },
    {
      title: "Tentang UKM PERISAI UMI",
      desc: "Profil lembaga penalaran & riset mahasiswa Universitas Muslim Indonesia.",
      href: "/tentang",
      icon: (
        <svg className="w-5 h-5 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: "Hubungi Sekretariat",
      desc: "Kirim pesan, konsultasi proposal ilmiah, atau undangan kemitraan.",
      href: "/kontak",
      icon: (
        <svg className="w-5 h-5 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#16161a] text-white selection:bg-[#FFB22C] selection:text-[#16161a] relative overflow-hidden">
      {/* Background radial ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#FFB22C]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] rounded-full bg-[#282F44]/40 blur-[130px] pointer-events-none" />

      {/* Top Bar Header */}
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

      {/* Main 404 Hero Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-16 px-6">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB22C]/30 bg-[#FFB22C]/10 px-4 py-1.5 text-xs font-bold text-[#FFB22C] shadow-inner">
            <span className="h-2 w-2 rounded-full bg-[#FFB22C] animate-ping" />
            <span>GALAT 404 • TAUTAN TIDAK DITEMUKAN</span>
          </div>

          {/* Number & Headline */}
          <div className="space-y-3">
            <h1 className="text-7xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFC85A] via-[#FFB22C] to-[#E68A00] drop-shadow-[0_10px_35px_rgba(255,178,44,0.3)]">
              404
            </h1>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Halaman Yang Anda Cari Tidak Ditemukan
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Tautan yang Anda akses mungkin salah ketik, telah diperbarui, atau materi telah diarsipkan oleh pengurus UKM PERISAI UMI.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-bold text-zinc-200 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Halaman Sebelumnya</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-7 py-3.5 text-xs sm:text-sm font-extrabold text-[#16161a] shadow-xl shadow-[#FFB22C]/20 hover:brightness-110 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          {/* Quick Helpful Directory Grid */}
          <div className="pt-8 border-t border-white/10 text-left">
            <p className="text-center text-xs font-bold uppercase tracking-wider text-zinc-500 mb-6">
              Atau Jelajahi Ruang Informasi Populer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-white/10 bg-[#202026]/70 p-4 transition-all duration-200 hover:border-[#FFB22C]/40 hover:bg-[#202026] hover:translate-y-[-2px] flex items-start gap-3.5 shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFB22C]/10 border border-[#FFB22C]/25 group-hover:scale-105 transition-transform">
                    {link.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FFB22C] transition-colors flex items-center gap-1.5">
                      <span>{link.title}</span>
                      <span className="text-xs text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                      {link.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-5 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} UKM PERISAI UMI Makassar. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}
