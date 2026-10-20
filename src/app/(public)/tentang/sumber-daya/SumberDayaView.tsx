"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

const GOLD = "#FFB22C";
const BG = "#17171a";

/* ------------------------------------------------------------------ */
/* Bintang 4-sudut (Sparkle) beranimasi                               */
/* ------------------------------------------------------------------ */
function Sparkle({
  className = "",
  size = 22,
  delay = 0,
  float = false,
}: {
  className?: string;
  size?: number;
  delay?: number;
  float?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 ${className}`}
      style={{
        animation: `${float ? "pr-float 5.5s" : "pr-twinkle 3s"} ease-in-out ${delay}s infinite`,
        filter: `drop-shadow(0 0 7px ${GOLD}99)`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={GOLD}>
        <path d="M12 0C12.6 7 17 11.4 24 12C17 12.6 12.6 17 12 24C11.4 17 7 12.6 0 12C7 11.4 11.4 7 12 0Z" />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Social Media Platforms & SVGs (LinkedIn, WhatsApp, TikTok, IG, FB, X, YT) */
/* ------------------------------------------------------------------ */
export type SocialPlatform =
  | "linkedin"
  | "whatsapp"
  | "tiktok"
  | "instagram"
  | "facebook"
  | "x"
  | "youtube";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

function SocialIcon({ platform, compact = false }: { platform: SocialPlatform; compact?: boolean }) {
  const iconSize = compact ? "w-3 h-3" : "w-3.5 h-3.5";

  switch (platform) {
    case "linkedin":
      return (
        <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.99v7.92c0 1.95-.5 3.94-1.61 5.5-1.52 2.14-4.08 3.51-6.72 3.54-2.58.04-5.14-1.22-6.68-3.29-1.59-2.13-1.89-5.06-1.03-7.58.91-2.65 3.21-4.63 5.96-5.16.89-.17 1.81-.2 2.71-.11v4.14c-1.14-.14-2.33.15-3.23.87-.93.74-1.42 1.92-1.32 3.09.1 1.16.79 2.19 1.81 2.73 1.02.54 2.29.47 3.28-.16.9-.57 1.45-1.58 1.45-2.64V.02h-0.75z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "x":
      return (
        <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Vector Person Silhouette Placeholder Elegan                        */
/* ------------------------------------------------------------------ */
function PersonPlaceholder({ className = "w-full h-full" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#25252f] via-[#1c1c24] to-[#141418] ${className}`}
    >
      {/* Radial soft gold highlight */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: "radial-gradient(circle at 50% 35%, rgba(255,178,44,0.35) 0%, transparent 68%)",
        }}
      />

      {/* Siluet Vektor Orang Minimalis */}
      <svg
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[72%] h-[72%] max-w-[155px] opacity-75 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:opacity-95 group-hover:scale-105"
      >
        {/* Kepala */}
        <circle
          cx="60"
          cy="46"
          r="26"
          fill="#2d2d38"
          stroke="#FFB22C"
          strokeWidth="1.8"
          strokeOpacity="0.4"
        />
        <circle cx="60" cy="46" r="21" fill="#363644" />

        {/* Bahu & Tubuh */}
        <path
          d="M16 138 C16 94 38 82 60 82 C82 82 104 94 104 138 Z"
          fill="#2d2d38"
          stroke="#FFB22C"
          strokeWidth="1.8"
          strokeOpacity="0.4"
        />
        <path
          d="M24 138 C24 102 42 92 60 92 C78 92 96 102 96 138 Z"
          fill="#363644"
        />

        {/* Kerah / Aksen Emas */}
        <path
          d="M52 83 L60 96 L68 83"
          stroke="#FFB22C"
          strokeWidth="1.6"
          strokeOpacity="0.55"
          fill="none"
        />
      </svg>

      {/* Gradasi Gelap Bawah */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Team Group Silhouette Placeholder untuk Departemen                */
/* ------------------------------------------------------------------ */
function TeamGroupPlaceholder() {
  return (
    <div className="relative w-full h-44 sm:h-52 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#23232c] via-[#1a1a20] to-[#141418] border border-[#FFB22C]/20 group-hover:border-[#FFB22C]/40 transition-all">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,178,44,0.25) 0%, transparent 70%)",
        }}
      />

      {/* Grid Pattern halus */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,178,44,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,178,44,0.25) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Siluet Tim (5 Figur Anggota Riset) */}
      <svg
        viewBox="0 0 240 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[85%] h-[85%] opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
      >
        {/* Figur Kiri Jauh */}
        <circle cx="45" cy="44" r="13" fill="#2d2d38" stroke="#FFB22C" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M22 105 C22 76 33 70 45 70 C57 70 68 76 68 105 Z" fill="#2d2d38" />

        {/* Figur Kanan Jauh */}
        <circle cx="195" cy="44" r="13" fill="#2d2d38" stroke="#FFB22C" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M172 105 C172 76 183 70 195 70 C207 70 218 76 218 105 Z" fill="#2d2d38" />

        {/* Figur Kiri Tengah */}
        <circle cx="85" cy="37" r="15" fill="#363644" stroke="#FFB22C" strokeWidth="1.2" strokeOpacity="0.4" />
        <path d="M58 105 C58 71 71 63 85 63 C99 63 112 71 112 105 Z" fill="#363644" />

        {/* Figur Kanan Tengah */}
        <circle cx="155" cy="37" r="15" fill="#363644" stroke="#FFB22C" strokeWidth="1.2" strokeOpacity="0.4" />
        <path d="M128 105 C128 71 141 63 155 63 C169 63 182 71 182 105 Z" fill="#363644" />

        {/* Figur Tengah (Pimpinan/Koordinator) */}
        <circle cx="120" cy="28" r="17" fill="#444455" stroke="#FFB22C" strokeWidth="1.8" strokeOpacity="0.6" />
        <path
          d="M92 105 C92 63 106 55 120 55 C134 55 148 63 148 105 Z"
          fill="#444455"
          stroke="#FFB22C"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        {/* Dasi / pin emas pimpinan */}
        <path d="M116 56 L120 66 L124 56" stroke="#FFB22C" strokeWidth="1.5" />
      </svg>

      {/* Label Formasi Tim */}
      <div className="absolute bottom-2.5 left-3 text-[10px] font-black uppercase tracking-wider text-[#FFB22C] bg-black/70 backdrop-blur-md px-3 py-0.5 rounded-full border border-[#FFB22C]/30">
        Foto Tim
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Card Profil Fungsionaris dengan Ukuran Responsif (Standard / Mini) */
/* ------------------------------------------------------------------ */
interface PersonCardProps {
  name: string;
  role: string;
  socials?: SocialLink[];
  compact?: boolean;
  size?: "standard" | "compact" | "mini";
}

function PersonCard({
  name,
  role,
  socials,
  compact = false,
  size = "standard",
}: PersonCardProps) {
  const isMini = size === "mini";
  const isCompact = size === "compact" || compact;

  // Default fallback: 1 icon LinkedIn jika tidak diisi secara custom
  const activeSocials =
    socials !== undefined
      ? socials.slice(0, 5)
      : ([{ platform: "linkedin", url: "https://www.linkedin.com" }] as SocialLink[]);

  return (
    <div
      className={`relative w-full ${isMini
          ? "max-w-[72px] sm:max-w-[110px] md:max-w-[145px] lg:max-w-[175px] rounded-lg sm:rounded-xl md:rounded-2xl"
          : isCompact
            ? "max-w-[120px] sm:max-w-[165px] md:max-w-[190px] rounded-xl sm:rounded-2xl"
            : "max-w-[115px] sm:max-w-[170px] md:max-w-[220px] rounded-xl sm:rounded-2xl"
        } aspect-[3/4] border border-[#FFB22C]/30 bg-[#202026] overflow-hidden flex flex-col justify-between shadow-lg transition-colors duration-200 hover:border-[#FFB22C] hover:shadow-[0_0_22px_rgba(255,178,44,0.35)] group mx-auto`}
    >
      {/* Top right: Tombol Icon Media Sosial (Dinamis hingga 5 icon, default LinkedIn) */}
      {activeSocials && activeSocials.length > 0 && (
        <div
          className={`absolute ${isMini
              ? "top-1 right-1 gap-0.5 max-w-[45px] sm:max-w-[80px]"
              : "top-1.5 right-1.5 sm:top-2 sm:right-2 gap-1 max-w-[70px] sm:max-w-[110px]"
            } z-30 flex items-center flex-wrap justify-end`}
          onClick={(e) => e.stopPropagation()}
        >
          {activeSocials.map((soc, idx) => {
            const href = soc.url.startsWith("http") ? soc.url : `https://${soc.url}`;
            return (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={`Buka ${soc.platform.toUpperCase()}`}
                aria-label={soc.platform}
                className={`${isMini
                    ? "w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5"
                    : "w-5 h-5 sm:w-6 sm:h-6 md:w-6.5 md:h-6.5"
                  } rounded-full bg-black/75 backdrop-blur-md border border-[#FFB22C]/40 text-[#FFB22C] hover:bg-[#FFB22C] hover:text-[#17171a] hover:border-[#FFB22C] flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 active:scale-95`}
              >
                <SocialIcon platform={soc.platform} compact={isMini || isCompact} />
              </a>
            );
          })}
        </div>
      )}

      {/* Area Gambar / Placeholder */}
      <div className="w-full h-full relative">
        <PersonPlaceholder />
      </div>

      {/* Bottom Nameplate Overlay: Hanya Nama & Jabatan */}
      <div
        className={`absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black via-black/90 to-transparent ${isMini
            ? "pt-3 sm:pt-4 pb-1 sm:pb-2 px-1"
            : "pt-4 sm:pt-6 pb-1.5 sm:pb-2.5 px-1.5 sm:px-2.5"
          } text-center`}
      >
        <p
          className={`${isMini
              ? "text-[7.5px] sm:text-[9.5px] md:text-xs"
              : "text-[9.5px] sm:text-xs md:text-sm"
            } font-bold text-white group-hover:text-[#FFB22C] transition-colors truncate`}
        >
          {name}
        </p>
        <p
          className={`${isMini
              ? "text-[6.5px] sm:text-[8px] md:text-[9.5px]"
              : "text-[8px] sm:text-[9.5px] md:text-[11px]"
            } font-black tracking-wider uppercase text-[#FFB22C] mt-0.5 truncate`}
        >
          {role}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Data Departemen Lengkap (6 Departemen PERISAI UMI)                 */
/* ------------------------------------------------------------------ */
interface DepartmentInfo {
  code: string;
  name: string;
  fullName: string;
  tagline: string;
  desc: string;
  focus: string[];
  programs: string[];
}

const DEPARTMENTS_DATA: DepartmentInfo[] = [
  {
    code: "PENALARAN",
    name: "PENALARAN",
    fullName: "Departemen Penalaran dan Keilmuan",
    tagline: "Kajian Ilmiah, Penulisan Riset & PKM",
    desc: "Pusat inkubasi budaya berpikir kritis, metodologi penelitian kuantitatif-kualitatif, penulisan karya ilmiah bereputasi, serta pengawalan Program Kreativitas Mahasiswa (PKM).",
    focus: [
      "Metodologi Penelitian & Desain Analisis Data",
      "Klinik Penulisan Naskah PKM & LKTI Lolos Didanai",
      "Kajian Dialektika & Bedah Isu Strategis Kontemporer",
      "Bimbingan Sitasi & Publikasi Jurnal Ilmiah Terindeks",
    ],
    programs: [
      "Sekolah Riset & Karya Tulis Ilmiah (SRKTI)",
      "Klinik Proposal PKM & Bedah Gagasan Nasional",
      "Forum Diskusi Dialektika Penalaran Mahasiswa",
      "Workshop Olah Data Statistik (SPSS/Python/R)",
    ],
  },
  {
    code: "RISTEK",
    name: "RISTEK",
    fullName: "Departemen Riset dan Teknologi",
    tagline: "Inovasi Sains Terapan & Hilirisasi Produk Digital",
    desc: "Membangun ekosistem riset terapan berbasis sains dan teknologi modern, rekayasa produk prototipe, inovasi perangkat lunak, serta hilirisasi karya riset mahasiswa.",
    focus: [
      "Riset Sains Terapan & Eksperimentasi Laboratorium",
      "Pengembangan Web, Mobile Apps & Solusi IoT",
      "Prototyping Produk Teknologi Tepat Guna",
      "Inkubasi Hak Kekayaan Intelektual (HKI/Paten)",
    ],
    programs: [
      "Ristek Innovation Lab & Prototyping Showcase",
      "Coding & Artificial Intelligence Bootcamp",
      "Pameran Gelar Produk Riset Mahasiswa UMI",
      "Hilirisasi Prototipe Teknologi Berkelanjutan",
    ],
  },
  {
    code: "KOMPRES",
    name: "KOMPRES",
    fullName: "Departemen Kompetisi dan Prestasi",
    tagline: "Scouting Delegasi & Inkubasi Juara Kompetisi",
    desc: "Wadah pendampingan delegasi mahasiswa UMI menuju kompetisi ilmiah bergengsi tingkat regional, nasional (PIMNAS, LIDM, KIBM), hingga internasional secara terukur dan berkelanjutan.",
    focus: [
      "Scouting Talenta & Pemetaan Peluang Kompetisi",
      "Bootcamp Presentasi & Simulasi Tanya-Jawab Juri",
      "Mentorship Eksklusif Bersama Mentor Juara",
      "Pencatatan Portofolio Rekor Prestasi Lembaga",
    ],
    programs: [
      "PERISAI Champions Incubation Bootcamp",
      "Scouting & Pendampingan Delegasi PIMNAS",
      "Simulasi Pitching & Presentasi Ilmiah",
      "PERISAI Award & Apresiasi Peneliti Berprestasi",
    ],
  },
  {
    code: "HUMAS",
    name: "HUMAS",
    fullName: "Departemen Hubungan Masyarakat",
    tagline: "Diplomasi Lembaga & Jejaring Kemitraan Eksternal",
    desc: "Membangun jembatan komunikasi diplomatis antara PERISAI UMI dengan birokrasi kampus, lembaga riset nasional (BRIN), industri mitra, organisasi riset antar-universitas, dan alumni.",
    focus: [
      "Diplomasi Kampus & Audiensi Strategis Pimpinan UMI",
      "Jejaring Lembaga Riset Nasional & Swasta",
      "Kemitraan Media Partner & Kolaborasi Antar-UKM",
      "Sinergi Ikatan Alumni Peneliti PERISAI UMI",
    ],
    programs: [
      "PERISAI Research Visit ke Lembaga Riset & Industri",
      "Audiensi & Dialog Birokrasi Universitas",
      "Silaturahmi Akbar Keluarga Alumni PERISAI",
      "Kolaborasi Riset Kolaboratif Lintas Kampus",
    ],
  },
  {
    code: "MEDIA",
    name: "MEDIA",
    fullName: "Departemen Media dan Informasi",
    tagline: "Visual Branding, Desain Kreatif & Publikasi Digital",
    desc: "Garda terdepan diseminasi informasi, infografis sains populer, video dokumenter riset, manajemen kanal sosial media resmi, serta visual identity UKM PERISAI UMI.",
    focus: [
      "Desain Komunikasi Visual & Konten Sains Populer",
      "Produksi Video Dokumentasi Riset & Motion Graphics",
      "Pengelolaan Website & Portal Berita Organisasi",
      "Strategi Social Media Branding & Interaksi Publik",
    ],
    programs: [
      "PERISAI Insight: Infografis Riset Populer Mingguan",
      "Podcast Suara Riset & Wawancara Peneliti Muda",
      "Pelatihan Desain Grafis & Multimedia Kreatif",
      "Publikasi Digital Buletin Riset PERISAI",
    ],
  },
  {
    code: "PSDM",
    name: "PSDM",
    fullName: "Departemen Pengembangan Sumber Daya Manusia",
    tagline: "Kaderisasi Berjenjang & Penguatan Soliditas Fungsionaris",
    desc: "Jantung regenerasi organisasi yang mengawal proses penerimaan kader baru, upgrading keterampilan manajerial kepengurusan, konseling internal, dan penguatan nilai integritas keislaman.",
    focus: [
      "Kaderisasi Berjenjang & Orientasi Nilai PERISAI",
      "Upgrading Soft Skills & Manajemen Kepemimpinan",
      "Monitoring & Evaluasi Kinerja Fungsionaris",
      "Harmonisasi Kekeluargaan & Soliditas Pengurus",
    ],
    programs: [
      "Masa Bimbingan Riset (MBR) Calon Anggota",
      "Upgrading Kepengurusan & Leadership Camp",
      "Rapat Evaluasi Triwulan Kinerja Departemen",
      "PERISAI Family Gathering & Malam Keakraban",
    ],
  },
];

/* Data Kepala Departemen untuk Carousel */
const KADEP_LIST = [
  { name: "Nama Kepala Departemen", role: "KADEP PENALARAN" },
  { name: "Nama Kepala Departemen", role: "KADEP RISTEK" },
  { name: "Nama Kepala Departemen", role: "KADEP KOMPRES" },
  { name: "Nama Kepala Departemen", role: "KADEP HUMAS" },
  { name: "Nama Kepala Departemen", role: "KADEP MEDIA" },
  { name: "Nama Kepala Departemen", role: "KADEP PSDM" },
];

/* Data Staf Ahli (10 Bidang) untuk Carousel 5 Card Berjejeran */
const STAF_AHLI_LIST = [
  { name: "Nama Staf Ahli", role: "STAF AHLI" },
  { name: "Nama Staf Ahli", role: "STAF AHLI" },
  { name: "Nama Staf Ahli", role: "STAF AHLI" },
  { name: "Nama Staf Ahli", role: "STAF AHLI" },
  { name: "Nama Staf Ahli", role: "STAF AHLI" },
  { name: "Nama Staf Ahli", role: "STAF AHLI" },
  { name: "Nama Staf Ahli", role: "STAF AHLI" },
  { name: "Nama Staf Ahli", role: "STAF AHLI" },
  { name: "Nama Staf Ahli", role: "STAF AHLI" },
  { name: "Nama Staf Ahli", role: "STAF AHLI" },
];

/* ------------------------------------------------------------------ */
/* Carousel Slider Komponen untuk Kepala Departemen                   */
/* Formasi 3 Card Bersusun: Tengah Agak Sedikit Lebih Tinggi          */
/* Efek Animasi: Scroll Horizontal (Track Sliding Reel)                */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Carousel Slider Komponen untuk Kepala Departemen                   */
/* Fitur: Auto-scroll Halus, Drag/Touch Swipe, Looping Kembali ke Awal*/
/* dan Sorotan Kartu Aktif di Tengah                                 */
/* ------------------------------------------------------------------ */
function KadepCarouselSection({
  items,
}: {
  items: typeof KADEP_LIST;
}) {
  const N = items.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  // Hitung offset agar kartu aktif tepat berada di tengah kontainer
  const updateOffset = useCallback(() => {
    if (!containerRef.current) return;
    const targetCard = cardRefs.current[currentIndex];
    if (!targetCard) return;

    const containerWidth = containerRef.current.clientWidth;
    const cardLeft = targetCard.offsetLeft;
    const cardWidth = targetCard.clientWidth;

    const newOffset = containerWidth / 2 - (cardLeft + cardWidth / 2);
    setTrackOffset(newOffset);
  }, [currentIndex]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    updateOffset();
  }, [updateOffset, isMounted]);

  useEffect(() => {
    const handleResize = () => updateOffset();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateOffset]);

  // Timer auto-scroll (berputar halus tiap 3.2 detik, loop kembali ke awal secara otomatis)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % N);
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused, N]);

  // Looping navigasi: jika sudah di akhir (N - 1), kembali lagi ke awal (0)
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? N - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % N);
  };

  const goToSlide = (dotIndex: number) => {
    setCurrentIndex(dotIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (diff > 40) {
        prevSlide();
      } else if (diff < -40) {
        nextSlide();
      }
    }
    touchStartX.current = null;
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto px-1.5 sm:px-6 my-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Judul Bagian */}
      <h3
        className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-wider text-[#FFB22C] text-center mb-2 sm:mb-3"
        style={{ textShadow: "0 4px 25px rgba(255, 178, 44, 0.4)" }}
      >
        KEPALA DEPARTEMEN
      </h3>

      {/* Garis Distributor Penghubung ke 3 Card */}
      <div className="w-full max-w-[280px] sm:max-w-xl md:max-w-2xl mx-auto pointer-events-none mb-2 sm:mb-3">
        <svg className="w-full h-7 sm:h-9" viewBox="0 0 600 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="300" y1="0" x2="300" y2="14" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <line x1="120" y1="14" x2="480" y2="14" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <line x1="120" y1="14" x2="120" y2="36" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <line x1="300" y1="14" x2="300" y2="20" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <line x1="480" y1="14" x2="480" y2="36" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <circle cx="120" cy="14" r="3" fill="#FFB22C" />
          <circle cx="300" cy="14" r="3.5" fill="#FFB22C" />
          <circle cx="480" cy="14" r="3" fill="#FFB22C" />
        </svg>
      </div>

      {/* Baris Slider dengan Tombol Navigasi Kiri & Kanan */}
      <div className="relative flex items-center justify-center gap-1.5 sm:gap-4 md:gap-6">
        {/* Tombol Panah Kiri */}
        <button
          onClick={prevSlide}
          aria-label="Sebelumnya"
          className="z-30 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#202026] border border-[#FFB22C]/40 text-[#FFB22C] flex items-center justify-center hover:bg-[#FFB22C] hover:text-[#17171a] transition shadow-lg shrink-0 group active:scale-95"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Viewport Track Carousel dengan Edge Masking Halus */}
        <div
          ref={containerRef}
          className="relative overflow-hidden w-full max-w-[290px] sm:max-w-xl md:max-w-3xl lg:max-w-4xl py-4 px-1"
        >
          {/* Subtle Side Fade Gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-12 bg-gradient-to-r from-[#17171a] to-transparent z-25" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-12 bg-gradient-to-l from-[#17171a] to-transparent z-25" />

          {/* Continuous Sliding Track dengan Loop Kembali ke Awal */}
          <div
            className="flex items-center gap-2 sm:gap-6 md:gap-8 will-change-transform"
            style={{
              transform: `translateX(${trackOffset}px)`,
              transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {items.map((item, idx) => {
              const distance = Math.abs(idx - currentIndex);
              const isCenter = distance === 0;
              const isNeighbor = distance === 1;

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 cursor-pointer transition-all duration-700 ease-out ${
                    isCenter
                      ? "z-30 scale-105 sm:scale-110 opacity-100 drop-shadow-[0_12px_28px_rgba(255,178,44,0.45)] ring-1.5 ring-[#FFB22C] rounded-2xl"
                      : isNeighbor
                      ? "z-20 scale-[0.93] sm:scale-[0.96] opacity-75 sm:opacity-85"
                      : "z-10 scale-[0.84] sm:scale-[0.86] opacity-35 sm:opacity-45"
                  } w-[115px] sm:w-[170px] md:w-[205px] lg:w-[225px]`}
                >
                  <PersonCard name={item.name} role={item.role} size="standard" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Tombol Panah Kanan */}
        <button
          onClick={nextSlide}
          aria-label="Selanjutnya"
          className="z-30 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#202026] border border-[#FFB22C]/40 text-[#FFB22C] flex items-center justify-center hover:bg-[#FFB22C] hover:text-[#17171a] transition shadow-lg shrink-0 group active:scale-95"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indikator Titik (Dots) dengan Status Aktif Halus */}
      <div className="flex justify-center items-center gap-1.5 mt-4 sm:mt-5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Ke slide ${i + 1}`}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-400 ${
              i === currentIndex
                ? "w-6 sm:w-8 bg-[#FFB22C] shadow-[0_0_10px_rgba(255,178,44,0.7)]"
                : "w-1.5 sm:w-2 bg-zinc-600 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Carousel Slider Komponen untuk Staf Ahli                           */
/* Fitur: Auto-scroll Halus, Drag/Touch Swipe, Looping Kembali ke Awal*/
/* dan Formasi Multi-Card Berjenjang Estetik                         */
/* ------------------------------------------------------------------ */
function StafAhliCarouselSection({
  items,
}: {
  items: typeof STAF_AHLI_LIST;
}) {
  const N = items.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  const updateOffset = useCallback(() => {
    if (!containerRef.current) return;
    const targetCard = cardRefs.current[currentIndex];
    if (!targetCard) return;

    const containerWidth = containerRef.current.clientWidth;
    const cardLeft = targetCard.offsetLeft;
    const cardWidth = targetCard.clientWidth;

    const newOffset = containerWidth / 2 - (cardLeft + cardWidth / 2);
    setTrackOffset(newOffset);
  }, [currentIndex]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    updateOffset();
  }, [updateOffset, isMounted]);

  useEffect(() => {
    const handleResize = () => updateOffset();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateOffset]);

  // Auto-scroll interval 3.2 detik, loop kembali ke awal
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % N);
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused, N]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? N - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % N);
  };

  const goToSlide = (dotIndex: number) => {
    setCurrentIndex(dotIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (diff > 40) {
        prevSlide();
      } else if (diff < -40) {
        nextSlide();
      }
    }
    touchStartX.current = null;
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <div
      className="w-full max-w-[1380px] mx-auto px-1 sm:px-4 my-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Judul Bagian */}
      <h3
        className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-wider text-[#FFB22C] text-center mb-2 sm:mb-3"
        style={{ textShadow: "0 4px 25px rgba(255, 178, 44, 0.4)" }}
      >
        STAF AHLI
      </h3>

      {/* Garis Distributor Penghubung ke 5 Card */}
      <div className="w-full max-w-[340px] sm:max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto pointer-events-none mb-2 sm:mb-3">
        <svg className="w-full h-8 sm:h-11" viewBox="0 0 1000 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="500" y1="0" x2="500" y2="14" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <line x1="100" y1="14" x2="900" y2="14" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <line x1="100" y1="14" x2="100" y2="48" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <line x1="300" y1="14" x2="300" y2="34" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <line x1="500" y1="14" x2="500" y2="20" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <line x1="700" y1="14" x2="700" y2="34" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <line x1="900" y1="14" x2="900" y2="48" stroke="#FFB22C" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }} />
          <circle cx="100" cy="14" r="3" fill="#FFB22C" />
          <circle cx="300" cy="14" r="3" fill="#FFB22C" />
          <circle cx="500" cy="14" r="3.5" fill="#FFB22C" />
          <circle cx="700" cy="14" r="3" fill="#FFB22C" />
          <circle cx="900" cy="14" r="3" fill="#FFB22C" />
        </svg>
      </div>

      {/* Baris Slider dengan Tombol Navigasi Kiri & Kanan */}
      <div className="relative flex items-center justify-center gap-1 sm:gap-3 md:gap-5">
        {/* Tombol Panah Kiri */}
        <button
          onClick={prevSlide}
          aria-label="Sebelumnya"
          className="z-30 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#202026] border border-[#FFB22C]/40 text-[#FFB22C] flex items-center justify-center hover:bg-[#FFB22C] hover:text-[#17171a] transition shadow-lg shrink-0 group active:scale-95"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Viewport Track Carousel dengan Edge Masking Halus */}
        <div
          ref={containerRef}
          className="relative overflow-hidden w-full max-w-[340px] sm:max-w-3xl md:max-w-5xl lg:max-w-6xl py-4 px-1"
        >
          {/* Subtle Side Fade Gradients for panoramic depth */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#17171a] to-transparent z-25" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#17171a] to-transparent z-25" />

          {/* Continuous Sliding Track dengan Loop Kembali ke Awal */}
          <div
            className="flex items-center gap-1.5 sm:gap-4 md:gap-5 lg:gap-6 will-change-transform"
            style={{
              transform: `translateX(${trackOffset}px)`,
              transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {items.map((item, idx) => {
              const distance = Math.abs(idx - currentIndex);
              const isCenter = distance === 0;
              const isInner = distance === 1;
              const isOuter = distance === 2;

              // Step class untuk efek bertingkat estetik
              const stepClass = isCenter ? "mt-0" : isInner ? "mt-2 sm:mt-0" : isOuter ? "mt-4 sm:mt-0" : "mt-6 sm:mt-0";

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 cursor-pointer transition-all duration-700 ease-out ${stepClass} ${
                    isCenter
                      ? "z-30 scale-105 sm:scale-110 opacity-100 drop-shadow-[0_12px_28px_rgba(255,178,44,0.45)] ring-1.5 ring-[#FFB22C] rounded-2xl"
                      : isInner
                      ? "z-20 scale-[0.93] sm:scale-[0.96] opacity-80 sm:opacity-90"
                      : isOuter
                      ? "z-10 scale-[0.85] sm:scale-[0.88] opacity-55 sm:opacity-65"
                      : "z-0 scale-[0.78] sm:scale-[0.8] opacity-20 sm:opacity-30"
                  } w-[100px] sm:w-[155px] md:w-[185px] lg:w-[205px]`}
                >
                  <PersonCard name={item.name} role={item.role} size="standard" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Tombol Panah Kanan */}
        <button
          onClick={nextSlide}
          aria-label="Selanjutnya"
          className="z-30 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#202026] border border-[#FFB22C]/40 text-[#FFB22C] flex items-center justify-center hover:bg-[#FFB22C] hover:text-[#17171a] transition shadow-lg shrink-0 group active:scale-95"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indikator Titik (Dots) */}
      <div className="flex justify-center items-center gap-1.5 mt-4 sm:mt-5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Ke slide ${i + 1}`}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-400 ${
              i === currentIndex
                ? "w-6 sm:w-8 bg-[#FFB22C] shadow-[0_0_10px_rgba(255,178,44,0.7)]"
                : "w-1.5 sm:w-2 bg-zinc-600 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal Detail Departemen                                            */
/* ------------------------------------------------------------------ */
function DepartmentModal({
  dept,
  onClose,
}: {
  dept: DepartmentInfo;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-[#FFB22C]/40 bg-[#1e1e24] p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          aria-label="Tutup Modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/50 border border-white/20 text-zinc-300 hover:text-white hover:border-[#FFB22C] flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Header Modal */}
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-[#FFB22C] px-3 py-1 text-xs font-black uppercase text-[#17171a]">
            {dept.code}
          </span>
          <span className="text-xs text-zinc-400 font-medium tracking-wide">
            UKM PERISAI UMI
          </span>
        </div>

        <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white">
          {dept.fullName}
        </h3>
        <p className="mt-1 text-xs sm:text-sm font-semibold text-[#FFB22C]">
          {dept.tagline}
        </p>

        <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/10 pt-4">
          {dept.desc}
        </p>

        {/* Fokus Bidang */}
        <div className="mt-5 space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#FFB22C]">
            Fokus & Ruang Lingkup
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
            {dept.focus.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#262630] p-2.5 rounded-xl border border-white/5">
                <span className="text-[#FFB22C] font-bold mt-0.5">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Program Unggulan */}
        <div className="mt-5 space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#FFB22C]">
            Program Kerja Unggulan
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
            {dept.programs.map((prog, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#262630] p-2.5 rounded-xl border border-white/5">
                <span className="text-[#FFB22C] font-bold mt-0.5">✓</span>
                <span>{prog}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Tombol Tutup */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#FFB22C] px-5 py-2.5 text-xs font-black text-[#17171a] hover:bg-[#FFC85A] transition shadow-md"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Komponen Utama Sumber Daya                                         */
/* ------------------------------------------------------------------ */
export function SumberDayaView() {
  const [selectedDept, setSelectedDept] = useState<DepartmentInfo | null>(null);

  return (
    <div
      className="relative text-white selection:bg-[#FFB22C] selection:text-[#1b1b1f] pb-6 sm:pb-8 overflow-hidden w-full max-w-[100vw]"
      style={{ background: BG }}
    >
      {/* Keyframes Animasi */}
      <style>{`
        @keyframes pr-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes pr-float {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50%      { transform: translateY(-10px); opacity: 1; }
        }
        @keyframes pr-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(1.05); }
        }
        @keyframes pr-slideInRight {
          0% {
            opacity: 0;
            transform: translateX(28px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes pr-slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-28px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Ambient Glow Latar Belakang (Clipped so it NEVER extends container height) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute top-[-60px] left-1/2 -translate-x-1/2 h-[460px] w-[860px] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, rgba(255,178,44,0.18) 0%, transparent 70%)",
            animation: "pr-glow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[750px] -right-32 h-[450px] w-[450px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(255,200,90,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[1400px] -left-32 h-[450px] w-[450px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(255,178,44,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[200px] -right-32 h-[450px] w-[450px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(255,178,44,0.1) 0%, transparent 70%)" }}
        />
      </div>

      {/* ======================================================== */}
      {/* 1. HERO HEADER                                           */}
      {/* ======================================================== */}
      <section className="relative pt-20 pb-10 sm:pt-24 sm:pb-14 text-center overflow-hidden">
        {/* Backing Image Kampus UMI Halus */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          <Image
            src="/og-default.webp"
            alt="Universitas Muslim Indonesia"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-15 filter blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#17171a]/70 via-[#17171a]/90 to-[#17171a]" />
        </div>

        {/* Sparkles Dekoratif */}
        <Sparkle className="top-14 left-[15%]" size={24} delay={0.2} float />
        <Sparkle className="top-20 right-[15%]" size={18} delay={1.4} />
        <Sparkle className="top-36 left-[8%]" size={16} delay={2.0} />
        <Sparkle className="top-40 right-[10%]" size={22} delay={0.8} float />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-[#FFB22C]"
            style={{ textShadow: "0 4px 30px rgba(255, 178, 44, 0.45)" }}
          >
            SUMBER DAYA
          </h1>
          <p className="mt-2 text-sm sm:text-xl md:text-2xl font-black uppercase tracking-widest text-white drop-shadow-md">
            PUSAT PENGEMBANGAN RISET MAHASISWA
          </p>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-medium">
            Formasi hierarki pengurus, dewan pembina, pengurus harian, kepala departemen, staf ahli, dan 6 departemen pergerakan riset UKM PERISAI UMI
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. BAGAN STRUKTUR PENGURUS & PERSONEL                     */}
      {/* ======================================================== */}
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* ---------------- LEVEL 1: PEMBINA ---------------- */}
        <div className="relative text-center my-4 sm:my-6">
          <Sparkle className="top-2 left-[20%]" size={20} delay={0.5} float />
          <Sparkle className="top-6 right-[22%]" size={16} delay={1.8} />

          <h2
            className="text-lg sm:text-2xl font-black uppercase tracking-widest text-[#FFB22C] drop-shadow-md mb-2.5 sm:mb-4"
            style={{ textShadow: "0 2px 18px rgba(255, 178, 44, 0.4)" }}
          >
            PEMBINA
          </h2>

          <div className="w-full max-w-[140px] sm:max-w-[190px] md:max-w-[220px] mx-auto">
            <PersonCard
              name="Nama Pembina"
              role="PEMBINA"
              size="standard"
            />
          </div>

          {/* Garis Vertikal Penghubung ke Level 2 (Ketua Umum) */}
          <div className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-[#FFB22C] to-[#FFB22C]/80 shadow-[0_0_8px_rgba(255,178,44,0.6)] mx-auto my-1.5 sm:my-2" />
        </div>

        {/* ---------------- LEVEL 2: PIMPINAN UTAMA & PIMPINAN SEKRETARIAT/KEUANGAN (KETUA LEBIH TINGGI DARI BENDAHARA & SEKRETARIS) ---------------- */}
        <div className="relative my-3 sm:my-4">
          <Sparkle className="top-10 left-[6%]" size={22} delay={1.1} float />
          <Sparkle className="top-14 right-[6%]" size={20} delay={2.3} />

          {/* Grid 3 Kolom Bertiga di Semua Ukuran Layar: Ketua Umum di tengah lebih tinggi */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 items-start max-w-[360px] sm:max-w-xl md:max-w-3xl mx-auto">
            {/* Kolom 1: BENDAHARA (Diberi margin top agar posisinya di bawah Ketum) */}
            <div className="text-center mt-3 sm:mt-6 md:mt-10">
              <h3
                className="text-[10px] sm:text-base md:text-lg font-black uppercase tracking-wider text-[#FFB22C] drop-shadow-md mb-1 sm:mb-2 truncate"
                style={{ textShadow: "0 2px 15px rgba(255, 178, 44, 0.4)" }}
              >
                BENDAHARA
              </h3>
              <PersonCard
                name="Nama Bendahara"
                role="BENDAHARA"
                size="standard"
              />
            </div>

            {/* Kolom 2: KETUA UMUM (Posisi di atas sebagai pucuk pimpinan, mt-0) */}
            <div className="text-center mt-0">
              <h3
                className="text-[11px] sm:text-lg md:text-xl font-black uppercase tracking-wider text-[#FFB22C] drop-shadow-md mb-1 sm:mb-2 truncate"
                style={{ textShadow: "0 2px 20px rgba(255, 178, 44, 0.5)" }}
              >
                KETUA UMUM
              </h3>
              <PersonCard
                name="Nama Ketua Umum"
                role="KETUA UMUM"
                size="standard"
              />
            </div>

            {/* Kolom 3: SEKRETARIS (Diberi margin top agar posisinya di bawah Ketum) */}
            <div className="text-center mt-3 sm:mt-6 md:mt-10">
              <h3
                className="text-[10px] sm:text-base md:text-lg font-black uppercase tracking-wider text-[#FFB22C] drop-shadow-md mb-1 sm:mb-2 truncate"
                style={{ textShadow: "0 2px 15px rgba(255, 178, 44, 0.4)" }}
              >
                SEKRETARIS
              </h3>
              <PersonCard
                name="Nama Sekretaris"
                role="SEKRETARIS"
                size="standard"
              />
            </div>
          </div>

          {/* Garis Konektor Melengkung dari dasar Ketua Umum ke Bendahara & Sekretaris (Tampil di Mobile & Desktop) */}
          <div className="w-full max-w-[360px] sm:max-w-xl md:max-w-3xl mx-auto my-1 pointer-events-none">
            <svg
              className="w-full h-10 sm:h-14 md:h-16"
              viewBox="0 0 600 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Garis vertikal pendek dari dasar Ketum ke simpul */}
              <line
                x1="300"
                y1="0"
                x2="300"
                y2="20"
                stroke="#FFB22C"
                strokeWidth="2"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }}
              />

              {/* Lengkungan ke kiri (Bendahara) */}
              <path
                d="M 300 20 C 300 48, 100 32, 100 70"
                stroke="#FFB22C"
                strokeWidth="2"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }}
              />

              {/* Lengkungan ke kanan (Sekretaris) */}
              <path
                d="M 300 20 C 300 48, 500 32, 500 70"
                stroke="#FFB22C"
                strokeWidth="2"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }}
              />

              {/* Garis vertikal tengah ke bawah menuju Kadep */}
              <line
                x1="300"
                y1="20"
                x2="300"
                y2="70"
                stroke="#FFB22C"
                strokeWidth="2"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,178,44,0.6))" }}
              />

              {/* Titik simpul emas */}
              <circle cx="300" cy="20" r="3.5" fill="#FFB22C" />
            </svg>
          </div>

          {/* Garis Vertikal Lanjutan ke Kepala Departemen */}
          <div className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-[#FFB22C] to-[#FFB22C]/80 shadow-[0_0_8px_rgba(255,178,44,0.6)] mx-auto my-1.5 sm:my-2" />
        </div>

        {/* ---------------- LEVEL 3: KEPALA DEPARTEMEN (AUTO-SCROLL CAROUSEL + CONNECTOR) ---------------- */}
        <div className="relative my-4">
          <Sparkle className="top-4 right-[12%]" size={18} delay={1.5} float />

          <KadepCarouselSection items={KADEP_LIST} />

          {/* Garis Vertikal Turun ke Staf Ahli */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-[#FFB22C] to-[#FFB22C]/80 shadow-[0_0_8px_rgba(255,178,44,0.6)] mx-auto my-2" />
        </div>

        {/* ---------------- LEVEL 4: STAF AHLI (5 CARD BERJEJERAN + GARIS PENGHUBUNG + AUTO-SCROLL) ---------------- */}
        <div className="relative my-4">
          <Sparkle className="top-4 left-[10%]" size={18} delay={0.9} float />

          <StafAhliCarouselSection items={STAF_AHLI_LIST} />

          {/* Garis Vertikal Turun ke Section Departemen */}
          <div className="w-0.5 h-10 bg-gradient-to-b from-[#FFB22C] to-[#FFB22C]/80 shadow-[0_0_8px_rgba(255,178,44,0.6)] mx-auto my-3" />
        </div>

        {/* Pembatas Elegan menuju Bagian Departemen */}
        <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#FFB22C]/40 to-transparent mx-auto my-8" />

        {/* ======================================================== */}
        {/* 3. SECTION DEPARTEMEN (3 CARD PER BARIS - MAKSIMAL RUANG)*/}
        {/* ======================================================== */}
        <section className="relative mt-8 mb-2">
          <Sparkle className="top-[-20px] left-[15%]" size={24} delay={0.4} float />
          <Sparkle className="top-[-10px] right-[15%]" size={20} delay={1.7} />

          <h2
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-[#FFB22C] text-center mb-8 sm:mb-12"
            style={{ textShadow: "0 4px 30px rgba(255, 178, 44, 0.45)" }}
          >
            DEPARTEMEN
          </h2>

          {/* Grid 6 Kartu Departemen (3 Satu Baris di Layar Besar, Ruang Dimaksimalkan) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-[1380px] mx-auto">
            {DEPARTMENTS_DATA.map((dept) => (
              <div
                key={dept.code}
                className="relative rounded-3xl border border-[#FFB22C]/30 bg-[#202026] overflow-hidden p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:border-[#FFB22C] hover:shadow-[0_0_30px_rgba(255,178,44,0.3)] hover:-translate-y-1.5 transition-all duration-300 group"
              >
                {/* Header Kartu: Tipografi Outline Emas */}
                <div>
                  <h3
                    className="text-2xl sm:text-3xl font-black tracking-widest uppercase text-transparent transition-all duration-300"
                    style={{
                      WebkitTextStroke: "1.5px #FFB22C",
                      textShadow: "0 0 18px rgba(255, 178, 44, 0.35)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {dept.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-zinc-300 mt-1 truncate">
                    {dept.fullName}
                  </p>
                </div>

                {/* Ilustrasi Placeholder Tim Departemen */}
                <div className="my-5">
                  <TeamGroupPlaceholder />
                </div>

                {/* Bagian Bawah Kartu: Subtitle & Tombol Pelajari */}
                <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-white/10">
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 truncate max-w-[180px]">
                    {dept.tagline}
                  </span>

                  <button
                    onClick={() => setSelectedDept(dept)}
                    className="rounded-xl bg-[#FFB22C] px-5 py-2 text-xs font-black text-[#17171a] hover:bg-[#FFC85A] transition shadow-md whitespace-nowrap active:scale-95"
                  >
                    Pelajari
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal Detail Departemen jika salah satu dipilih */}
      {selectedDept && (
        <DepartmentModal
          dept={selectedDept}
          onClose={() => setSelectedDept(null)}
        />
      )}
    </div>
  );
}
