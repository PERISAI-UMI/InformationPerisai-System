"use client";

import { useState } from "react";
import Image from "next/image";

export interface OrganogramMember {
  id: string;
  name: string;
  nim?: string | null;
  faculty?: string | null;
  position: string;
  tier: "pembina" | "inti" | "kadep" | "staf";
  photoUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUsername?: string | null;
  department?: { id: string; name: string } | null;
  orderIndex: number;
}

interface OrganogramChartProps {
  members: OrganogramMember[];
}

export function OrganogramChart({ members = [] }: OrganogramChartProps) {
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const deptTabs = [
    { id: "all", label: "Semua Fungsionaris" },
    { id: "bph", label: "BPH Inti" },
    { id: "psdm", label: "PSDM" },
    { id: "media", label: "Media" },
    { id: "kompres", label: "KOMPRES" },
    { id: "humas", label: "HUMAS" },
    { id: "ristek", label: "RISTEK" },
    { id: "penalaran", label: "Penalaran" },
  ];

  // Filter members based on selected department tab
  const filteredMembers = members.filter((m) => {
    if (selectedDept === "all") return true;
    if (selectedDept === "bph") {
      const pos = m.position.toLowerCase();
      return pos.includes("ketua umum") || pos.includes("sekretaris umum") || pos.includes("bendahara umum");
    }
    const deptSlug = m.department?.id?.toLowerCase() || "";
    const pos = m.position.toLowerCase();
    return deptSlug.includes(selectedDept) || pos.includes(selectedDept);
  });

  return (
    <div className="space-y-16">
      {/* ======================================================== */}
      {/* 1. VISUAL ORGANOGRAM SCHEMATIC DIAGRAM                   */}
      {/* ======================================================== */}
      <div className="rounded-3xl border border-[#FFB22C]/30 bg-gradient-to-b from-[#25252b] via-[#1e1e24] to-[#17171a] p-6 sm:p-10 shadow-2xl overflow-x-auto">
        <div className="min-w-[760px] max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Header Bagan */}
          <div className="text-center mb-8">
            <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#1b1b1f]">
              Bagan Hirarki Struktural
            </span>
            <h3 className="mt-2 text-xl font-bold text-white">
              Struktur Kepengurusan UKM PERISAI UMI
            </h3>
          </div>

          {/* LEVEL 1: PEMBINA TOP */}
          <div className="flex flex-col items-center">
            <div className="rounded-xl border-2 border-[#FFB22C] bg-[#2b2b31] px-8 py-3 text-center shadow-[0_0_15px_rgba(255,178,44,0.3)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB22C] block">
                Pelindung & Penasihat
              </span>
              <span className="text-sm font-black text-white">
                Pembina
              </span>
              <span className="text-[11px] text-zinc-400 block mt-0.5">
                Wakil Rektor III / Birokrasi UMI
              </span>
            </div>

            {/* Vertical Connector Line */}
            <div className="w-0.5 h-6 bg-[#FFB22C]/70" />
          </div>

          {/* LEVEL 2: ROW WITH PEMBINA (LEFT) - KETUA UMUM (CENTER) - DPO (RIGHT) */}
          <div className="w-full grid grid-cols-12 items-center gap-4 my-2">
            {/* Left: Pembina Pendamping */}
            <div className="col-span-3 flex justify-end">
              <div className="rounded-xl border border-white/20 bg-[#2b2b31]/90 px-4 py-2.5 text-center shadow-md w-full max-w-[190px]">
                <span className="text-[10px] font-bold uppercase text-[#FFB22C] block">Birokrasi Kampus</span>
                <span className="text-xs font-bold text-white">Dewan Pembina</span>
              </div>
            </div>

            {/* Center: Connector Left to Center */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="w-full h-0.5 border-t-2 border-dashed border-[#FFB22C]/60" />
            </div>

            {/* Center: Ketua Umum Box */}
            <div className="col-span-4 flex justify-center">
              <div className="rounded-2xl border-2 border-[#FFB22C] bg-gradient-to-r from-[#2b2b31] via-[#35353d] to-[#2b2b31] px-6 py-3.5 text-center shadow-[0_0_20px_rgba(255,178,44,0.4)] w-full">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFB22C] block">
                  Mandataris Organisasi
                </span>
                <span className="text-base font-black text-white block">
                  Ketua Umum
                </span>
                <span className="text-[11px] font-semibold text-zinc-300 block mt-0.5">
                  Aisyah Ramadhani Muchlis (PRN0238)
                </span>
              </div>
            </div>

            {/* Center to Right Connector */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="w-full h-0.5 border-t-2 border-dashed border-[#FFB22C]/60" />
            </div>

            {/* Right: DPO Box */}
            <div className="col-span-3 flex justify-start">
              <div className="rounded-xl border border-white/20 bg-[#2b2b31]/90 px-4 py-2.5 text-center shadow-md w-full max-w-[190px]">
                <span className="text-[10px] font-bold uppercase text-[#FFB22C] block">7 Demisioner</span>
                <span className="text-xs font-bold text-white">DPO</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Dewan Pertimbangan</span>
              </div>
            </div>
          </div>

          {/* Vertical Connector Line from Ketum */}
          <div className="w-0.5 h-6 bg-[#FFB22C]/70" />

          {/* LEVEL 3: SEKRETARIS UMUM & BENDAHARA UMUM */}
          <div className="flex items-center gap-8 my-1">
            <div className="rounded-xl border border-[#FFB22C]/50 bg-[#2b2b31] px-6 py-2.5 text-center shadow-lg min-w-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB22C] block">
                BPH Pimpinan
              </span>
              <span className="text-xs font-black text-white">
                Sekretaris Umum
              </span>
              <span className="text-[10px] text-zinc-300 block mt-0.5">
                Baiq Indar Pirayati (PRN0241)
              </span>
            </div>

            <div className="rounded-xl border border-[#FFB22C]/50 bg-[#2b2b31] px-6 py-2.5 text-center shadow-lg min-w-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB22C] block">
                BPH Pimpinan
              </span>
              <span className="text-xs font-black text-white">
                Bendahara Umum
              </span>
              <span className="text-[10px] text-zinc-300 block mt-0.5">
                Muhammad Aidhil Aksan (PRN0250)
              </span>
            </div>
          </div>

          {/* Horizontal Split Line for Departemen */}
          <div className="w-0.5 h-6 bg-[#FFB22C]/70" />
          <div className="w-[88%] h-0.5 bg-[#FFB22C]/60" />

          {/* LEVEL 4: KEPALA DEPARTEMEN GRID */}
          <div className="w-full grid grid-cols-6 gap-2.5 pt-4">
            <div className="rounded-xl border border-white/15 bg-[#2b2b31] p-2.5 text-center shadow-md">
              <span className="text-[9px] font-extrabold text-[#FFB22C] block">Kadep</span>
              <span className="text-xs font-bold text-white block">Penalaran</span>
            </div>

            <div className="rounded-xl border border-white/15 bg-[#2b2b31] p-2.5 text-center shadow-md">
              <span className="text-[9px] font-extrabold text-[#FFB22C] block">Kadep</span>
              <span className="text-xs font-bold text-white block">Media</span>
            </div>

            <div className="rounded-xl border border-white/15 bg-[#2b2b31] p-2.5 text-center shadow-md">
              <span className="text-[9px] font-extrabold text-[#FFB22C] block">Kadep</span>
              <span className="text-xs font-bold text-white block">Ristek</span>
            </div>

            <div className="rounded-xl border border-white/15 bg-[#2b2b31] p-2.5 text-center shadow-md">
              <span className="text-[9px] font-extrabold text-[#FFB22C] block">Kadep</span>
              <span className="text-xs font-bold text-white block">Kompres</span>
            </div>

            <div className="rounded-xl border border-white/15 bg-[#2b2b31] p-2.5 text-center shadow-md">
              <span className="text-[9px] font-extrabold text-[#FFB22C] block">Kadep</span>
              <span className="text-xs font-bold text-white block">PSDM</span>
            </div>

            <div className="rounded-xl border border-white/15 bg-[#2b2b31] p-2.5 text-center shadow-md">
              <span className="text-[9px] font-extrabold text-[#FFB22C] block">Kadep</span>
              <span className="text-xs font-bold text-white block">Humas</span>
            </div>
          </div>

          {/* Connector to Staf Ahli */}
          <div className="w-0.5 h-6 bg-[#FFB22C]/70 mt-4" />

          {/* LEVEL 5: STAF AHLI DEPARTEMEN */}
          <div className="rounded-xl border border-[#FFB22C]/40 bg-[#2b2b31] px-10 py-3 text-center shadow-md max-w-md w-full">
            <span className="text-xs font-extrabold text-white block">
              Staf Ahli Departemen
            </span>
            <span className="text-[11px] text-zinc-300 block mt-0.5">
              Seluruh fungsionaris operasional bidang keilmuan dan riset
            </span>
          </div>

          {/* Connector to Anggota Biasa */}
          <div className="w-0.5 h-6 bg-[#FFB22C]/70" />

          {/* LEVEL 6: ANGGOTA BIASA */}
          <div className="rounded-xl border border-white/15 bg-[#242429] px-12 py-2.5 text-center shadow-sm max-w-sm w-full">
            <span className="text-xs font-bold text-zinc-300 block">
              Anggota Biasa
            </span>
            <span className="text-[10px] text-zinc-400 block">
              Generasi Baru Inovator PERISAI UMI
            </span>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DIREKTORI 42 FUNGSIONARIS RIIL DENGAN FILTER TAB     */}
      {/* ======================================================== */}
      <div className="space-y-8">
        <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1b1b1f]">
              Direktori Fungsionaris Riil
            </span>
            <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Daftar Pengurus Periode Aktif 2026/2027
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Total 42 fungsionaris aktif terdaftar dengan ID Login PRN resmi
            </p>
          </div>

          <span className="text-xs font-bold text-[#FFB22C] bg-[#FFB22C]/10 border border-[#FFB22C]/20 px-3 py-1 rounded-full self-start sm:self-auto">
            {filteredMembers.length} Fungsionaris Ditampilkan
          </span>
        </div>

        {/* Filter Tabs by Department */}
        <div className="flex flex-wrap items-center gap-2">
          {deptTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDept(tab.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedDept === tab.id
                  ? "bg-[#FFB22C] text-[#1b1b1f] font-extrabold shadow-[0_0_12px_rgba(255,178,44,0.35)]"
                  : "bg-[#2b2b31] text-zinc-300 border border-white/10 hover:border-[#FFB22C]/40 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((m) => {
            const isBph =
              m.position.toLowerCase().includes("ketua umum") ||
              m.position.toLowerCase().includes("sekretaris umum") ||
              m.position.toLowerCase().includes("bendahara umum");

            return (
              <div
                key={m.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  isBph
                    ? "border-[#FFB22C] bg-gradient-to-b from-[#2b2b31] via-[#24242b] to-[#1c1c20] shadow-[0_0_20px_rgba(255,178,44,0.15)]"
                    : "border-white/10 bg-[#2b2b31]/80 hover:border-[#FFB22C]/50 hover:bg-[#2b2b31]"
                }`}
              >
                {/* Header Tag PRN */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-mono text-xs font-black text-[#FFB22C] bg-[#FFB22C]/10 px-2 py-0.5 rounded border border-[#FFB22C]/30">
                    {m.id}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                    {m.department?.name || "BPH"}
                  </span>
                </div>

                {/* Avatar & Profile */}
                <div className="flex flex-col items-center text-center my-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#FFB22C] bg-[#1b1b1f] shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={m.photoUrl || "/maskot.png"}
                      alt={m.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <h4 className="mt-3 text-sm font-extrabold text-white group-hover:text-[#FFB22C] transition-colors line-clamp-1">
                    {m.name}
                  </h4>
                  <p className="mt-0.5 text-xs font-bold text-[#FFB22C]">
                    {m.position}
                  </p>
                </div>

                {/* Footer Info: Social Links if any */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Generasi 10/11</span>
                  <div className="flex items-center gap-2">
                    {m.instagramUsername && (
                      <a
                        href={
                          m.instagramUsername.startsWith("http")
                            ? m.instagramUsername
                            : `https://${m.instagramUsername}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-[#FFB22C] transition-colors"
                        title="Instagram"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    )}
                    {m.linkedinUrl && (
                      <a
                        href={
                          m.linkedinUrl.startsWith("http")
                            ? m.linkedinUrl
                            : `https://${m.linkedinUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-[#FFB22C] transition-colors"
                        title="LinkedIn"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
