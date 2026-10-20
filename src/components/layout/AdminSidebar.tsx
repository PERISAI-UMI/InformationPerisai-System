"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  superAdminOnly?: boolean;
  adminOrSuperOnly?: boolean;
  icon: (props: { className?: string }) => React.JSX.Element;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AdminSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();

  const navSections: NavSection[] = [
    {
      title: "UTAMA",
      items: [
        {
          label: "Dasbor",
          href: "/admin",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "KONTEN PUBLIK",
      items: [
        {
          label: "Postingan Berita",
          href: "/admin/posts",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          ),
        },
        {
          label: "Peluang & Lomba",
          href: "/admin/opportunities",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          ),
        },
        {
          label: "Galeri Media",
          href: "/admin/gallery",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "ORGANISASI",
      items: [
        {
          label: "Departemen",
          href: "/admin/departments",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
        {
          label: "Program Kerja",
          href: "/admin/work-programs",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          ),
        },
        {
          label: "Struktur Anggota",
          href: "/admin/members",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
        {
          label: "Periode",
          href: "/admin/periods",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          label: "Keuangan Kas",
          href: "/admin/finance",
          adminOrSuperOnly: true,
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          label: "Statistik",
          href: "/admin/statistics",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "KOMUNIKASI",
      items: [
        {
          label: "Pesan Masuk",
          href: "/admin/inbox",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "SISTEM & KEAMANAN",
      items: [
        {
          label: "Pengaturan",
          href: "/admin/settings",
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          label: "Pengguna & Akses",
          href: "/admin/users",
          superAdminOnly: true,
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
        },
        {
          label: "Log Audit",
          href: "/admin/audit-log",
          superAdminOnly: true,
          icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-[#1a1a20] flex flex-col justify-between h-screen sticky top-0 overflow-y-auto no-scrollbar">
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 rounded-xl bg-[#FFB22C]/10 border border-[#FFB22C]/30 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(255,178,44,0.15)] group-hover:scale-105 transition-transform">
              <Image
                src="/logoperisaii.webp"
                alt="PERISAI UMI"
                width={28}
                height={28}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wide text-white block leading-tight">
                PANEL PERISAI
              </span>
              <span className="text-[10px] uppercase font-bold text-[#FFB22C] tracking-wider block">
                UKM PERISAI UMI
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Groups */}
        <div className="px-3 py-4 space-y-6">
          {navSections.map((section) => {
            const visibleItems = section.items.filter((item) => {
              if (item.superAdminOnly && userRole !== "SUPER_ADMIN") return false;
              if (item.adminOrSuperOnly && userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title}>
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">
                  {section.title}
                </p>
                <nav className="space-y-1">
                  {visibleItems.map((item) => {
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);

                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/20"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive ? "text-[#1b1b1f]" : "text-[#FFB22C]"
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 border-t border-white/10 m-3 rounded-2xl bg-white/[0.03] border border-white/5">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300 font-medium">Sistem Aktif</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFB22C]/10 text-[#FFB22C] border border-[#FFB22C]/30">
            {userRole === "SUPER_ADMIN" ? "Super Admin" : userRole === "ADMIN" ? "Pengurus & Kadep" : "Editor"}
          </span>
        </div>
      </div>
    </aside>
  );
}
