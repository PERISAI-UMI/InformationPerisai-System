"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  superAdminOnly?: boolean;
}

export function AdminSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: "Dasbor", href: "/admin", icon: "📊" },
    { label: "Postingan Berita", href: "/admin/posts", icon: "📰" },
    { label: "Program Kerja", href: "/admin/work-programs", icon: "📋" },
    { label: "Peluang & Lomba", href: "/admin/opportunities", icon: "🏆" },
    { label: "Departemen", href: "/admin/departments", icon: "🏛️" },
    { label: "Struktur Anggota", href: "/admin/members", icon: "👥" },
    { label: "Periode", href: "/admin/periods", icon: "📅" },
    { label: "Statistik", href: "/admin/statistics", icon: "📈" },
    { label: "Galeri Media", href: "/admin/gallery", icon: "🖼️" },
    { label: "Pesan Masuk", href: "/admin/inbox", icon: "✉️" },
    { label: "Pengaturan", href: "/admin/settings", icon: "⚙️" },
    { label: "Pengguna", href: "/admin/users", icon: "👤", superAdminOnly: true },
    { label: "Log Audit", href: "/admin/audit-log", icon: "📜", superAdminOnly: true },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-[#3d4663] bg-[#282F44] text-[#ECECEC]">
      <div className="flex h-16 items-center px-6 border-b border-[#3d4663]">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/logoperisaii.png"
            alt="PERISAI UMI"
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
          />
          <span className="font-bold text-sm tracking-wide text-white">Panel PERISAI</span>
        </Link>
      </div>

      <div className="px-3 py-4">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-[#F5D061]">
          Menu Pengurus
        </p>
        <nav className="mt-2 space-y-1">
          {navItems.map((item) => {
            if (item.superAdminOnly && userRole !== "SUPER_ADMIN") {
              return null;
            }

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-[#E6AF2E] text-[#282F44] font-bold shadow-sm"
                    : "text-zinc-300 hover:bg-[#343c55] hover:text-white"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
