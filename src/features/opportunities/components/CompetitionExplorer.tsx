"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { OpportunityCard } from "./OpportunityCard";

export interface OpportunityItem {
  id: string;
  type: string;
  title: string;
  slug: string;
  category?: string | null;
  tingkat?: string | null;
  organizer?: string | null;
  description?: string | null;
  deadlineAt?: string | null;
  registrationUrl?: string | null;
  coverImageUrl?: string | null;
  status: string;
  isOpen: boolean;
  daysLeft?: number | null;
  isUrgent?: boolean;
}

interface CompetitionExplorerProps {
  initialItems: OpportunityItem[];
  typeCounts?: Record<string, number>;
}

export function CompetitionExplorer({ initialItems }: CompetitionExplorerProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const gridTopRef = useRef<HTMLDivElement>(null);

  // Deteksi tampilan mobile untuk batas pagination: HP = 8 card, Desktop = 9 card
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter items sesuai pencarian
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return initialItems;
    const query = searchQuery.toLowerCase().trim();
    return initialItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.organizer && item.organizer.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.type && item.type.toLowerCase().includes(query))
      );
    });
  }, [initialItems, searchQuery]);

  // Reset page ke 1 saat pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Batas pagination: HP = 8 card, Desktop = 9 card
  const pageSize = isMobile ? 8 : 9;
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (activePage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={gridTopRef} className="space-y-8 scroll-mt-24">
      {/* Header Bar: Judul 'Daftar Perlombaan & Pendanaan' sejajar dengan Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Daftar Perlombaan & Pendanaan
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFB22C]/15 border border-[#FFB22C]/30 text-[#FFB22C] font-semibold">
            {totalItems} peluang
          </span>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full sm:w-72 md:w-80 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kompetisi atau beasiswa..."
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 pl-10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-[#FFB22C] focus:outline-none focus:ring-1 focus:ring-[#FFB22C] transition"
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs p-1"
              aria-label="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid List Hasil: 2 Card per Baris di HP (grid-cols-2), 3 Card di Desktop */}
      <div>
        {paginatedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#202026]/50 p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-[#FFB22C]/10 flex items-center justify-center text-[#FFB22C] text-2xl mb-4">
              🏆
            </div>
            <h4 className="text-lg font-bold text-white">Tidak Ada Peluang Ditemukan</h4>
            <p className="mt-1 text-sm text-zinc-400 max-w-md">
              Tidak ditemukan kompetisi atau beasiswa yang sesuai dengan kata kunci &quot;{searchQuery}&quot;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-6 rounded-full bg-[#FFB22C] px-5 py-2 text-xs font-bold text-[#1b1b1f] hover:brightness-110"
            >
              Tampilkan Semua Peluang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {paginatedItems.map((item) => (
              <OpportunityCard key={item.id} opportunity={item} hrefPrefix="/competition" />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <p className="text-xs sm:text-sm text-zinc-400 order-2 sm:order-1">
            Menampilkan <strong className="text-white">{startIndex + 1}</strong>–
            <strong className="text-white">{Math.min(startIndex + pageSize, totalItems)}</strong> dari{" "}
            <strong className="text-white">{totalItems}</strong> peluang
          </p>

          <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
            {/* Tombol Sebelumnya */}
            <button
              type="button"
              onClick={() => goToPage(activePage - 1)}
              disabled={activePage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>←</span>
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Nomor Halaman */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === activePage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    className={`h-8 w-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                      isActive
                        ? "bg-[#FFB22C] text-[#1b1b1f] shadow-[0_0_15px_rgba(255,178,44,0.35)]"
                        : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Tombol Selanjutnya */}
            <button
              type="button"
              onClick={() => goToPage(activePage + 1)}
              disabled={activePage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
