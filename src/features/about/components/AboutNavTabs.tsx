"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const aboutNavItems = [
  { label: "Sejarah Perisai", href: "/tentang/sejarah" },
  { label: "Visi, Misi, dan Tujuan", href: "/tentang/visi-misi" },
  { label: "Struktur Organisasi", href: "/tentang/struktur" },
  { label: "Sumber Daya", href: "/tentang/sumber-daya" },
];

export function AboutNavTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-8">
      {aboutNavItems.map((item) => {
        const isActive =
          pathname === item.href ||
          pathname === item.href.replace("/tentang", "/about");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 shadow-sm",
              isActive
                ? "bg-[#FFB22C] text-[#1b1b1f] font-extrabold shadow-[0_0_15px_rgba(255,178,44,0.35)] ring-2 ring-[#FFB22C]/50"
                : "bg-[#2b2b31]/80 text-zinc-300 border border-white/10 hover:border-[#FFB22C]/40 hover:bg-[#FFB22C]/10 hover:text-[#FFB22C]"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
