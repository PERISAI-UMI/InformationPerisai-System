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
              "rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm",
              isActive
                ? "bg-[#E6AF2E] text-[#282F44] shadow-md ring-2 ring-[#E6AF2E]/40"
                : "bg-[#ECECEC] text-[#282F44] hover:bg-[#E6AF2E] hover:text-[#282F44] dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-[#E6AF2E] dark:hover:text-[#282F44]"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
