import Image from "next/image";
import Link from "next/link";
import { AboutNavTabs } from "@/features/about/components/AboutNavTabs";
import { getPublicDepartments } from "@/features/departments/queries.public";
import { getPublicWorkPrograms } from "@/features/work-programs/queries.public";
import { getPublicGallery } from "@/features/gallery/queries.public";
import { DepartmentCard } from "@/features/departments/components/DepartmentCard";
import { WorkProgramCard } from "@/features/work-programs/components/WorkProgramCard";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sumber Daya, Fasilitas & Departemen — UKM PERISAI UMI",
  description:
    "Fasilitas riset, inventaris intelektual, departemen penggerak, program kerja, dan galeri kegiatan UKM PERISAI Universitas Muslim Indonesia.",
};

export default async function SumberDayaPage() {
  const [departments, workPrograms, galleryData] = await Promise.all([
    getPublicDepartments(),
    getPublicWorkPrograms(),
    getPublicGallery({ pageSize: 12 }),
  ]);

  const resourceCategories = [
    {
      icon: "🏢",
      title: "Ruang Kolaborasi & Sekretariat",
      badge: "Infrastruktur Fisik",
      desc: "Pusat aktivitas, diskusi riset, rapat kerja fungsionaris, dan bimbingan proposal ilmiah.",
      features: [
        "Sekretariat Utama: Gedung Menara UMI Lt. 4 / PKM Kampus 2 UMI",
        "Area Diskusi & Brainstorming Nyaman Ber-AC",
        "Akses Jaringan Internet Kampus Berkecepatan Tinggi",
        "Papan Analisis Gagasan & Whiteboard Kolaboratif",
      ],
    },
    {
      icon: "💻",
      title: "Peralatan & Fasilitas Komputasi",
      badge: "Perangkat Keras & Alat",
      desc: "Sarana penunjang olah data kuantitatif/kualitatif, penyusunan naskah, dan simulasi teknologi.",
      features: [
        "Workstation Komputer Riset & Olah Data Statistik",
        "Perangkat Presentasi Digital & Proyektor Multimedia",
        "Perangkat Cetak Naskah & Pengarsipan Dokumen",
        "Perangkat Audio-Visual untuk Dokumentasi & Podcast Riset",
      ],
    },
    {
      icon: "📚",
      title: "Repositori Intelektual & Bank Data",
      badge: "Aset Pengetahuan",
      desc: "Koleksi rujukan berharga hasil dedikasi penelitian anggota dari generasi ke generasi.",
      features: [
        "Bank Proposal: 100+ Naskah PKM & LKTI Lolos Didanai / Juara",
        "Koleksi Buku Panduan Riset & Metodologi Ilmiah Terapan",
        "Modul Pelatihan Software Analisis (SPSS, SmartPLS, Python, R)",
        "Panduan Manajemen Sitasi Standar (Mendeley, Zotero)",
      ],
    },
    {
      icon: "🤝",
      title: "Jejaring Pakar & Mentor Riset",
      badge: "Sumber Daya Manusia",
      desc: "Ekosistem bimbingan intensif dari dosen pembina, alumni peneliti, dan praktisi industri.",
      features: [
        "Jejaring Pembimbing Khusus per Bidang Keilmuan",
        "Forum Diskusi & Review Proposal Berkala",
        "Koneksi Lembaga Riset Nasional (BRIN, Kemendikbudristek)",
        "Mentorship Eksklusif bagi Delegasi Kompetisi Prestasi",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#1b1b1f] text-[#ECECEC] pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-[#FFB22C]/20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/og-default.jpg"
            alt="Universitas Muslim Indonesia"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1b1f]/80 via-[#1b1b1f]/90 to-[#1b1b1f]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[120px] pointer-events-none opacity-30"
            style={{ background: "radial-gradient(circle, #FFB22C 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-[#FFB22C]"
            style={{ textShadow: "0 4px 30px rgba(255, 178, 44, 0.45)" }}
          >
            SUMBER DAYA & FASILITAS
          </h1>
          <p className="mt-2 text-base sm:text-xl md:text-2xl font-black uppercase tracking-widest text-white drop-shadow-md">
            PUSAT PENGEMBANGAN RISET MAHASISWA
          </p>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-medium">
            Fasilitas laboratorium riset, departemen penggerak, agenda program kerja, dan arsip galeri kegiatan UKM PERISAI UMI
          </p>

          <div className="mt-8 flex justify-center">
            <AboutNavTabs />
          </div>

          {/* Quick Jump Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            <a
              href="#fasilitas"
              className="rounded-full bg-[#2b2b31] border border-white/10 px-4 py-1.5 text-zinc-300 hover:border-[#FFB22C] hover:text-[#FFB22C] transition"
            >
              🏢 Sarana & Fasilitas
            </a>
            <a
              href="#departemen"
              className="rounded-full bg-[#2b2b31] border border-white/10 px-4 py-1.5 text-zinc-300 hover:border-[#FFB22C] hover:text-[#FFB22C] transition"
            >
              🏛️ Departemen ({departments.length})
            </a>
            <a
              href="#proker"
              className="rounded-full bg-[#2b2b31] border border-white/10 px-4 py-1.5 text-zinc-300 hover:border-[#FFB22C] hover:text-[#FFB22C] transition"
            >
              📋 Program Kerja ({workPrograms.length})
            </a>
            <a
              href="#galeri"
              className="rounded-full bg-[#2b2b31] border border-white/10 px-4 py-1.5 text-zinc-300 hover:border-[#FFB22C] hover:text-[#FFB22C] transition"
            >
              🖼️ Galeri Media
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-20">
        {/* 1. FASILITAS & SARANA */}
        <section id="fasilitas" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1b1b1f]">
              Pilar Sarana
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Sarana, Alat & Repositori Ilmiah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {resourceCategories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-[#FFB22C]/20 bg-[#2b2b31]/80 p-7 sm:p-8 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-[#FFB22C]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="rounded-full bg-[#FFB22C]/15 border border-[#FFB22C]/30 px-3 py-1 text-[11px] font-black text-[#FFB22C]">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                    {cat.desc}
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                    {cat.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200"
                      >
                        <span className="text-[#FFB22C] font-bold mt-0.5">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. DEPARTEMEN ORGANISASI */}
        <section id="departemen" className="space-y-8 scroll-mt-24 pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1b1b1f]">
              Struktur Bidang
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Departemen Penggerak Organisasi
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Unit-unit fungsional yang mengelola kaderisasi, riset, publikasi, dan jejaring kerjasama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </section>

        {/* 3. PROGRAM KERJA */}
        <section id="proker" className="space-y-8 scroll-mt-24 pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1b1b1f]">
              Agenda & Kegiatan
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Program Kerja Terstruktur
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Rencana aksi nyata fungsionaris pada periode aktif 2026/2027.
            </p>
          </div>

          {workPrograms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-zinc-400">
              Belum ada program kerja yang dipublikasikan saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workPrograms.map((proker) => (
                <WorkProgramCard key={proker.id} program={proker} />
              ))}
            </div>
          )}
        </section>

        {/* 4. GALERI DOKUMENTASI MEDIA */}
        <section id="galeri" className="space-y-8 scroll-mt-24 pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1b1b1f]">
              Dokumentasi Visual
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Galeri Kegiatan & Momen
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Potret jejak langkah penelitian, seminar, pengabdian, dan kebersamaan keluarga besar PERISAI UMI.
            </p>
          </div>

          <GalleryGrid
            items={galleryData.items.map((it) => ({
              id: it.id,
              url: it.url,
              originalName: it.caption,
            }))}
          />
        </section>

        {/* Bottom CTA */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#2b2b31] via-[#222228] to-[#1b1b1f] p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <span className="rounded-md bg-[#FFB22C] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#1b1b1f]">
              Kemitraan & Riset
            </span>
            <h3 className="mt-2 text-xl font-bold text-white">
              Ingin Menjalin Kerjasama atau Memanfaatkan Fasilitas Riset?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-lg">
              Hubungi pengurus UKM PERISAI UMI untuk audiensi, kolaborasi riset, maupun pelatihan karya ilmiah.
            </p>
          </div>
          <Link
            href="/kontak"
            className="inline-flex items-center justify-center rounded-xl bg-[#FFB22C] px-6 py-3 text-xs font-black text-[#1b1b1f] hover:bg-[#FFC85A] transition whitespace-nowrap shadow-[0_0_15px_rgba(255,178,44,0.3)]"
          >
            Hubungi Pengurus →
          </Link>
        </div>
      </div>
    </div>
  );
}
