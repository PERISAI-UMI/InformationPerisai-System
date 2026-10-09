"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const aboutDropdownItems = [
  { label: "Sejarah Perisai", href: "/tentang/sejarah" },
  { label: "Visi, Misi, dan Tujuan", href: "/tentang/visi-misi" },
  { label: "Struktur Organisasi", href: "/tentang/struktur" },
  { label: "Sumber Daya", href: "/tentang/sumber-daya" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAboutOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsAboutOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isHomeActive = pathname === "/";
  const isAboutActive = pathname.startsWith("/tentang") || pathname.startsWith("/about");
  const isActivityActive = pathname.startsWith("/activity") || pathname.startsWith("/kabar");
  const isCompetitionActive = pathname.startsWith("/competition") || pathname.startsWith("/peluang");
  const isContactActive = pathname.startsWith("/kontak");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#FFB22C]/20 bg-[#1b1b1f]/90 backdrop-blur-xl text-[#ECECEC] transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logoperisaidengantulisan.png"
            alt="Logo UKM PERISAI UMI"
            width={180}
            height={48}
            priority
            className="h-10 w-auto object-contain transition hover:brightness-110"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 sm:gap-2">
          {/* Beranda */}
          <Link
            href="/"
            className={cn(
              "text-xs sm:text-sm font-bold transition-all px-4 py-1.5 rounded-full",
              isHomeActive
                ? "bg-[#FFB22C] text-[#1b1b1f] shadow-[0_0_14px_rgba(255,178,44,0.35)]"
                : "text-zinc-300 hover:text-[#FFB22C] hover:bg-white/5"
            )}
          >
            Beranda
          </Link>

          {/* Tentang Dropdown Button */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer",
                isAboutActive
                  ? "bg-[#FFB22C] text-[#1b1b1f] ring-2 ring-[#FFB22C]/40 shadow-[0_0_14px_rgba(255,178,44,0.35)]"
                  : isAboutOpen
                  ? "bg-[#FFB22C]/90 text-[#1b1b1f]"
                  : "text-zinc-300 hover:text-[#FFB22C] hover:bg-white/5"
              )}
              aria-expanded={isAboutOpen}
            >
              <span>Tentang</span>
              <span className="text-[9px] transition-transform duration-200 inline-block font-sans">
                ▼
              </span>
            </button>

            {/* Dropdown Menu Container */}
            {isAboutOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-2xl bg-[#2b2b31]/95 p-2.5 shadow-2xl border border-[#FFB22C]/30 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex flex-col gap-1.5">
                  {aboutDropdownItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname === item.href.replace("/tentang", "/about");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "w-full rounded-xl px-4 py-2.5 text-center text-xs font-bold transition-all shadow-xs",
                          isActive
                            ? "bg-[#FFB22C] text-[#1b1b1f] shadow-sm font-extrabold"
                            : "bg-white/5 text-zinc-200 hover:bg-[#FFB22C] hover:text-[#1b1b1f]"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Activity */}
          <Link
            href="/activity"
            className={cn(
              "text-xs sm:text-sm font-bold transition-all px-4 py-1.5 rounded-full",
              isActivityActive
                ? "bg-[#FFB22C] text-[#1b1b1f] shadow-[0_0_14px_rgba(255,178,44,0.35)]"
                : "text-zinc-300 hover:text-[#FFB22C] hover:bg-white/5"
            )}
          >
            Activity
          </Link>

          {/* Competition */}
          <Link
            href="/competition"
            className={cn(
              "text-xs sm:text-sm font-bold transition-all px-4 py-1.5 rounded-full",
              isCompetitionActive
                ? "bg-[#FFB22C] text-[#1b1b1f] shadow-[0_0_14px_rgba(255,178,44,0.35)]"
                : "text-zinc-300 hover:text-[#FFB22C] hover:bg-white/5"
            )}
          >
            Competition
          </Link>

          {/* Kontak */}
          <Link
            href="/kontak"
            className={cn(
              "text-xs sm:text-sm font-bold transition-all px-4 py-1.5 rounded-full",
              isContactActive
                ? "bg-[#FFB22C] text-[#1b1b1f] shadow-[0_0_14px_rgba(255,178,44,0.35)]"
                : "text-zinc-300 hover:text-[#FFB22C] hover:bg-white/5"
            )}
          >
            Kontak
          </Link>
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-[#FFB22C] bg-[#FFB22C]/10 px-4 py-1.5 text-xs font-bold text-[#FFB22C] transition-all duration-300 hover:bg-[#FFB22C] hover:text-[#1b1b1f] hover:shadow-[0_0_20px_rgba(255,178,44,0.35)]"
          >
            Portal Pengurus
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-zinc-300 hover:text-[#FFB22C] hover:bg-white/5 cursor-pointer"
            aria-label="Buka Menu"
          >
            {isMobileMenuOpen ? (
              <span className="text-xl font-bold text-[#FFB22C]">✕</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#FFB22C]/20 bg-[#1b1b1f]/98 backdrop-blur-2xl px-4 py-4 animate-in slide-from-top duration-200 shadow-2xl">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition",
                isHomeActive ? "bg-[#FFB22C] text-[#1b1b1f] font-bold" : "text-zinc-200 hover:bg-white/5 hover:text-[#FFB22C]"
              )}
            >
              Beranda
            </Link>

            {/* Mobile Tentang Submenu */}
            <div className="rounded-xl border border-white/10 p-3 bg-[#2b2b31]/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFC85A]">
                  Tentang PERISAI UMI
                </span>
                <span className="rounded-full bg-[#FFB22C] px-2 py-0.5 text-[10px] font-bold text-[#1b1b1f]">
                  Submenu
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {aboutDropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-center text-zinc-200 hover:bg-[#FFB22C] hover:text-[#1b1b1f] transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/activity"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition",
                isActivityActive ? "bg-[#FFB22C] text-[#1b1b1f] font-bold" : "text-zinc-200 hover:bg-white/5 hover:text-[#FFB22C]"
              )}
            >
              Activity (Warta Berita)
            </Link>

            <Link
              href="/competition"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition",
                isCompetitionActive ? "bg-[#FFB22C] text-[#1b1b1f] font-bold" : "text-zinc-200 hover:bg-white/5 hover:text-[#FFB22C]"
              )}
            >
              Competition (Peluang & Lomba)
            </Link>

            <Link
              href="/kontak"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition",
                isContactActive ? "bg-[#FFB22C] text-[#1b1b1f] font-bold" : "text-zinc-200 hover:bg-white/5 hover:text-[#FFB22C]"
              )}
            >
              Kontak
            </Link>

            <div className="pt-2 border-t border-white/10 mt-2">
              <Link
                href="/admin/login"
                className="flex w-full items-center justify-center rounded-full bg-[#FFB22C] py-2.5 text-xs font-bold text-[#1b1b1f] shadow-lg hover:brightness-110 transition"
              >
                Portal Pengurus
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
