import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#FFB22C]/20 bg-[#141417] text-[#ECECEC]">
      {/* Ambient Celestial Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-32 w-3/4 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "rgba(255, 178, 44, 0.05)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {/* Top Row: Logo, Nav Links, Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
          {/* Logo */}
          <Link href="/" className="inline-block shrink-0 transition hover:brightness-110">
            <Image
              src="/logoperisaidengantulisan.png"
              alt="Logo UKM PERISAI UMI"
              width={180}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Horizontal Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-zinc-300">
            <Link href="/" className="hover:text-[#FFB22C] transition">
              Beranda
            </Link>
            <Link href="/tentang" className="hover:text-[#FFB22C] transition">
              Tentang
            </Link>
            <Link href="/activity" className="hover:text-[#FFB22C] transition">
              Activity
            </Link>
            <Link href="/competition" className="hover:text-[#FFB22C] transition">
              Competition
            </Link>
            <Link href="/kontak" className="hover:text-[#FFB22C] transition">
              Kontak
            </Link>
          </nav>

          {/* Social Icons (SVGs with Gold Hover Glow) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Instagram */}
            <a
              href="https://instagram.com/ukmperisai_umi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2b2b31] border border-white/10 text-zinc-300 hover:border-[#FFB22C] hover:bg-[#FFB22C] hover:text-[#1b1b1f] hover:scale-110 hover:shadow-[0_0_15px_rgba(255,178,44,0.35)] transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@ukmperisaiumi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2b2b31] border border-white/10 text-zinc-300 hover:border-[#FFB22C] hover:bg-[#FFB22C] hover:text-[#1b1b1f] hover:scale-110 hover:shadow-[0_0_15px_rgba(255,178,44,0.35)] transition-all duration-300"
              aria-label="YouTube"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@ukmperisaiumi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2b2b31] border border-white/10 text-zinc-300 hover:border-[#FFB22C] hover:bg-[#FFB22C] hover:text-[#1b1b1f] hover:scale-110 hover:shadow-[0_0_15px_rgba(255,178,44,0.35)] transition-all duration-300"
              aria-label="TikTok"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.46 2.72 1.34-.05 2.56-.99 2.89-2.3.11-.47.16-.95.16-1.43V.02z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/perisaiumi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2b2b31] border border-white/10 text-zinc-300 hover:border-[#FFB22C] hover:bg-[#FFB22C] hover:text-[#1b1b1f] hover:scale-110 hover:shadow-[0_0_15px_rgba(255,178,44,0.35)] transition-all duration-300"
              aria-label="Facebook"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Middle Row: Contact Address & Quick Interaction */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Contact Info */}
          <div className="md:col-span-7 space-y-3">
            <span className="inline-block rounded-md bg-[#FFB22C] px-3 py-1 text-[11px] font-black uppercase text-[#1b1b1f]">
              Hubungi Kami
            </span>
            <div className="text-xs text-zinc-300 space-y-1.5 leading-relaxed">
              <p className="font-bold text-white text-sm">
                Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia
              </p>
              <p>Gedung Menara UMI Lt. 4 / Sekretariat PKM UMI Kampus II</p>
              <p>Jl. Urip Sumoharjo KM 5, Panaikang, Panakkukang, Makassar, Sulawesi Selatan 90231</p>
              <p className="pt-1 font-semibold" style={{ color: "#FFC85A" }}>
                Email: ukmperisai@umi.ac.id | Narahubung: +62 812-3456-7890
              </p>
            </div>
          </div>

          {/* Right: Input box with Button */}
          <div className="md:col-span-5">
            <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-white/10 bg-[#2b2b31] p-2 shadow-xl">
              <input
                type="email"
                placeholder="Masukkan email Anda..."
                className="w-full bg-transparent px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden"
              />
              <Link
                href="/kontak"
                className="w-full sm:w-auto shrink-0 rounded-xl bg-[#FFB22C] px-5 py-2.5 text-center text-xs font-black text-[#1b1b1f] shadow-md hover:brightness-110 transition-all duration-300"
              >
                Tinggalkan Pesan →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-zinc-400">
          <p>© {currentYear} UKM PERISAI UMI. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <Link href="/tentang/sumber-daya" className="hover:text-[#FFB22C] transition">
              Sumber Daya
            </Link>
            <Link href="/admin/login" className="hover:text-[#FFB22C] transition">
              Portal Pengurus
            </Link>
            <Link href="/kontak" className="hover:text-[#FFB22C] transition">
              Pusat Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
