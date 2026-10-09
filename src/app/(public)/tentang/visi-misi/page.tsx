import { AboutNavTabs } from "@/features/about/components/AboutNavTabs";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi, Misi, dan Tujuan — UKM PERISAI UMI",
  description: "Visi, misi, dan pilar tujuan strategis UKM PERISAI Universitas Muslim Indonesia sebagai pusat riset dan inovasi mahasiswa.",
};

export default function VisiMisiPage() {
  const missions = [
    {
      no: "01",
      title: "Kultur Riset & Metodologi",
      desc: "Mewadahi, memfasilitasi, dan mengembangkan potensi mahasiswa UMI dalam bidang penalaran ilmiah, metodologi riset terapan, dan penulisan karya tulis ilmiah.",
    },
    {
      no: "02",
      title: "Inkubasi Prestasi Kompetitif",
      desc: "Mengakselerasi partisipasi dan raihan prestasi mahasiswa pada kompetisi nasional bereputasi tinggi (PIMNAS/PKM, P2MW, PPK Ormawa, Gemastik, dan LKTI Internasional).",
    },
    {
      no: "03",
      title: "Kolaborasi Riset Terapan",
      desc: "Membangun jejaring kolaborasi riset interdisipliner dengan civitas akademika, institusi penelitian pemerintah, dan mitra dunia industri.",
    },
    {
      no: "04",
      title: "Integritas Nilai Keislaman",
      desc: "Menanamkan etika riset ilmiah yang berintegritas, berakhlak mulia, dan selaras dengan nilai-nilai Islam rahmatan lil 'alamin.",
    },
  ];

  const goals = [
    {
      icon: "💡",
      title: "Inkubasi Gagasan Inovatif",
      desc: "Melahirkan karya riset solutif yang aplikatif bagi pemecahan isu sosial, sains, dan teknologi kemasyarakatan.",
    },
    {
      icon: "🎓",
      title: "Kaderisasi Insan Peneliti",
      desc: "Mencetak peneliti muda yang kritis, analitis, adaptif, serta memiliki daya saing akademik di tingkat global.",
    },
    {
      icon: "🏆",
      title: "Reputasi Prestasi Almamater",
      desc: "Mengharumkan nama almamater Universitas Muslim Indonesia di panggung sains dan kompetisi ilmiah nasional.",
    },
    {
      icon: "🌱",
      title: "Hilirisasi Karya & Keberlanjutan",
      desc: "Mendorong transformasi prototipe hasil penelitian menjadi solusi nyata, wirausaha berbasis teknologi, atau jurnal terindeks.",
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <AboutNavTabs />

        {/* Header Hero */}
        <div className="text-center mt-6 mb-12">
          <span className="rounded-full bg-[#E6AF2E]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9c7112] dark:text-[#F5D061] border border-[#E6AF2E]/30">
            Arah & Komitmen
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-[#282F44] dark:text-zinc-100">
            Visi, Misi, dan Tujuan
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Fondasi cita-cita, komitmen kerja, serta target jangka panjang UKM PERISAI UMI.
          </p>
        </div>

        {/* Visi Highlight Card */}
        <div className="rounded-3xl border-2 border-[#E6AF2E] bg-gradient-to-br from-[#E6AF2E]/15 via-white to-white p-8 sm:p-12 shadow-sm dark:from-[#E6AF2E]/20 dark:via-zinc-900 dark:to-zinc-900 mb-12">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6AF2E] text-xl font-bold text-[#282F44] shadow-sm">
              🎯
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c7112] dark:text-[#F5D061]">
              Visi Utama
            </span>
          </div>
          <p className="mt-6 text-xl sm:text-2xl font-black leading-snug text-[#282F44] dark:text-zinc-100">
            &ldquo;Menjadi pusat riset, penalaran, dan inovasi mahasiswa terdepan yang berlandaskan nilai-nilai keislaman serta berdaya saing di kancah nasional maupun internasional.&rdquo;
          </p>
        </div>

        {/* Misi Cards */}
        <div className="space-y-6 mb-16">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#282F44] dark:text-zinc-100">
              🚀 Misi Organisasi
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Empat pilar aksi nyata pengurus dalam mewujudkan visi kelembagaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {missions.map((m) => (
              <div
                key={m.no}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs hover:border-[#E6AF2E] transition-all dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-black text-[#E6AF2E]">
                    {m.no}
                  </span>
                  <h3 className="text-base font-bold text-[#282F44] dark:text-zinc-100">
                    {m.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tujuan Strategis (5 Pilar) */}
        <div className="space-y-6 mb-16">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#282F44] dark:text-zinc-100">
              📌 Tujuan Strategis
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Capaian nyata yang diorientasikan bagi seluruh anggota dan civitas akademika UMI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {goals.map((g, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <span className="text-2xl">{g.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#282F44] dark:text-zinc-100">
                  {g.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="rounded-3xl border border-[#3d4663] bg-[#282F44] p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Ingin Mengetahui Formasi Kepengurusan?</h3>
            <p className="text-xs text-zinc-300 mt-1">
              Lihat bagan hierarki struktural kepengurusan aktif periode berjalan.
            </p>
          </div>
          <Link
            href="/tentang/struktur"
            className="rounded-xl bg-[#E6AF2E] px-6 py-2.5 text-xs font-bold text-[#282F44] hover:bg-[#F5D061] transition whitespace-nowrap shadow-sm"
          >
            Lihat Struktur Organisasi →
          </Link>
        </div>
      </div>
    </div>
  );
}
