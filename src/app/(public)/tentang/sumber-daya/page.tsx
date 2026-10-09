import { AboutNavTabs } from "@/features/about/components/AboutNavTabs";
import { getPublicDepartments } from "@/features/departments/queries.public";
import { getPublicWorkPrograms } from "@/features/work-programs/queries.public";
import { getPublicGallery } from "@/features/gallery/queries.public";
import { DepartmentCard } from "@/features/departments/components/DepartmentCard";
import { WorkProgramCard } from "@/features/work-programs/components/WorkProgramCard";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sumber Daya, Departemen & Program Kerja — UKM PERISAI UMI",
  description: "Fasilitas riset, departemen penggerak, program kerja terencana, dan galeri dokumentasi UKM PERISAI Universitas Muslim Indonesia.",
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
        "Sekretariat Utama: Gedung Menara UMI Lt. 4 / PKM UMI",
        "Area Diskusi & Brainstorming Ber-AC",
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
      icon: "👥",
      title: "Jejaring Pembimbing & Alumni",
      badge: "Sumber Daya Insani",
      desc: "Dukungan para akademisi senior dan alumni periset yang berkarier di lembaga riset terkemuka.",
      features: [
        "Dosen Pembina & Reviewer Bersertifikat Nasional",
        "Mentoring Intensif Menjelang Seleksi PIMNAS & Hibah Dikti",
        "Jaringan Alumni di BRIN, Instansi Pemerintah, & Industri Teknologi",
        "Komunitas Kolaborator Riset Lintas Fakultas se-UMI",
      ],
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Navigation Tabs */}
        <div className="max-w-5xl mx-auto">
          <AboutNavTabs />
        </div>

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="rounded-full bg-[#E6AF2E]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9c7112] dark:text-[#F5D061] border border-[#E6AF2E]/30">
            Aset & Ekosistem
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-[#282F44] dark:text-zinc-100">
            Sumber Daya Organisasi
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Fasilitas riset, departemen penggerak, agenda program kerja terencana, dan dokumentasi galeri UKM PERISAI UMI.
          </p>

          {/* Quick Jump Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            <a href="#fasilitas" className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 hover:bg-[#E6AF2E] hover:text-[#282F44] transition">
              🏢 Sarana & Fasilitas
            </a>
            <a href="#departemen" className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 hover:bg-[#E6AF2E] hover:text-[#282F44] transition">
              🏛️ Departemen ({departments.length})
            </a>
            <a href="#proker" className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 hover:bg-[#E6AF2E] hover:text-[#282F44] transition">
              📋 Program Kerja ({workPrograms.length})
            </a>
            <a href="#galeri" className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 hover:bg-[#E6AF2E] hover:text-[#282F44] transition">
              🖼️ Galeri Media
            </a>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. FASILITAS & SARANA RISET                              */}
        {/* ======================================================== */}
        <section id="fasilitas" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E6AF2E]">
              Pilar Sarana
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#282F44] dark:text-zinc-100">
              Sarana, Alat & Repositori Ilmiah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {resourceCategories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-8 shadow-xs hover:border-[#E6AF2E] transition-all dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#282F44] dark:text-zinc-100">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {cat.desc}
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                    {cat.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        <span className="text-[#E6AF2E] font-bold mt-0.5">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. DEPARTEMEN ORGANISASI                                 */}
        {/* ======================================================== */}
        <section id="departemen" className="space-y-8 scroll-mt-24 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E6AF2E]">
              Struktur Bidang
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#282F44] dark:text-zinc-100">
              Departemen Penggerak Organisasi
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Unit-unit bidang teknis yang mengelola kaderisasi, riset, publikasi, dan jejaring kerjasama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. PROGRAM KERJA (PROKER)                                */}
        {/* ======================================================== */}
        <section id="proker" className="space-y-8 scroll-mt-24 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E6AF2E]">
              Agenda & Kegiatan
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#282F44] dark:text-zinc-100">
              Program Kerja Terstruktur
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Rencana aksi nyata dan kegiatan riset fungsionaris pada periode berjalan.
            </p>
          </div>

          {workPrograms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
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

        {/* ======================================================== */}
        {/* 4. GALERI DOKUMENTASI MEDIA                              */}
        {/* ======================================================== */}
        <section id="galeri" className="space-y-8 scroll-mt-24 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E6AF2E]">
              Dokumentasi Visual
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#282F44] dark:text-zinc-100">
              Galeri Kegiatan & Momen
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Potret jejak langkah penelitian, seminar, pengabdian, dan kebersamaan keluarga besar PERISAI UMI.
            </p>
          </div>

          <GalleryGrid items={galleryData.items.map((it) => ({ id: it.id, url: it.url, originalName: it.caption }))} />
        </section>

        {/* Call to action at bottom */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-[#3d4663] bg-[#282F44] p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="rounded-md bg-[#E6AF2E] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#282F44]">
              Kemitraan & Kunjungan
            </span>
            <h3 className="mt-2 text-xl font-bold text-white">
              Ingin Menjalin Kerjasama atau Memanfaatkan Fasilitas Riset?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-300 max-w-lg">
              Hubungi sekretariat UKM PERISAI UMI untuk audiensi, kolaborasi riset, maupun pelatihan karya ilmiah.
            </p>
          </div>
          <Link
            href="/kontak"
            className="inline-flex items-center justify-center rounded-xl bg-[#E6AF2E] px-6 py-3 text-xs font-bold text-[#282F44] hover:bg-[#F5D061] transition whitespace-nowrap shadow-md"
          >
            Hubungi Pengurus →
          </Link>
        </div>
      </div>
    </div>
  );
}
