import { getPublicSettings } from "@/features/settings/queries.public";
import { AboutNavTabs } from "@/features/about/components/AboutNavTabs";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sejarah PERISAI UMI — Pusat Riset Mahasiswa",
  description: "Lintas sejarah, tonggak berdirinya 5 Mei 2015, dan filosofi lambang UKM PERISAI Universitas Muslim Indonesia.",
};

export default async function SejarahPage() {
  const settings = await getPublicSettings();
  const historyContent =
    settings.history_content ||
    "Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia (UKM PERISAI UMI) adalah unit kegiatan mahasiswa tingkat universitas yang berfokus pada penalaran, riset ilmiah, dan inovasi teknologi mahasiswa.";

  const milestones = [
    {
      year: "2015",
      title: "Deklarasi & Inisiasi Berdirinya Organisasi",
      desc: "Pada tanggal 5 Mei 2015 di Kampus 2 UMI Makassar, sekelompok mahasiswa periset dari berbagai fakultas menginisiasi wadah penelitian ilmiah terpadu di bawah naungan nilai-nilai keislaman.",
    },
    {
      year: "2017",
      title: "Pengakuan Universitas & Kiprah PIMNAS Perdana",
      desc: "Mendapatkan Surat Keputusan resmi Rektorat Universitas Muslim Indonesia dan berhasil meloloskan tim delegasi perdana ke Pekan Ilmiah Mahasiswa Nasional (PIMNAS).",
    },
    {
      year: "2019",
      title: "Ekspansi Departemen Riset Terapan",
      desc: "Memperluas struktur riset dengan pembagian fokus sains teknologi dan sosial humaniora, serta meluncurkan program pembinaan kepenulisan karya tulis ilmiah (KTI) intensif.",
    },
    {
      year: "2021",
      title: "Akselerasi Hibah Prestasi Nasional",
      desc: "Mencapai rekor pendanaan proposal PKM (Program Kreativitas Mahasiswa), lolos program P2MW (Kewirausahaan Mahasiswa), dan hibah PPK Ormawa tingkat Kemendikbudristek.",
    },
    {
      year: "Sekarang",
      title: "Transformasi Digital & Ekosistem Riset Modern",
      desc: "Meluncurkan portal informasi terintegrasi PERISAI UMI, digitalisasi arsip karya riset, dan memperluas jejaring kemitraan dengan instansi riset nasional dan industri.",
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
            Perjalanan Organisasi
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-[#282F44] dark:text-zinc-100">
            Sejarah UKM PERISAI UMI
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Menelusuri jejak langkah dedikasi para periset muda Universitas Muslim Indonesia sejak 5 Mei 2015.
          </p>
        </div>

        {/* Cerita Pendirian & Logo Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-2xl font-extrabold text-[#282F44] dark:text-zinc-100">
                Latar Belakang Pendirian
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {historyContent}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                UKM PERISAI UMI lahir dari kegelisahan akan minimnya ekosistem pembinaan riset komprehensif bagi mahasiswa di lingkungan kampus. Dengan memadukan integritas akhlakul karimah dan ketajaman metodologi ilmiah, organisasi ini terus tumbuh menjadi inkubator prestasi penalaran terkemuka.
              </p>
            </div>
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <Image
                src="/logoperisaidengantulisan.png"
                alt="Logo Resmi UKM PERISAI UMI"
                width={260}
                height={160}
                className="h-auto max-h-40 w-auto object-contain drop-shadow"
              />
              <p className="mt-4 text-xs font-semibold text-zinc-500 text-center">
                Pusat Pengembangan Riset Mahasiswa<br />Universitas Muslim Indonesia
              </p>
            </div>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="space-y-8 mb-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#282F44] dark:text-zinc-100">
              Tonggak Sejarah & Milestone
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Evolusi dan pencapaian krusial dari masa ke masa.
            </p>
          </div>

          <div className="relative border-l-2 border-[#E6AF2E] ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10 py-4">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Dot marker */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 h-5 w-5 rounded-full border-4 border-white bg-[#E6AF2E] shadow dark:border-zinc-900 group-hover:scale-125 transition-transform" />
                
                <span className="inline-block rounded-md bg-[#282F44] px-3 py-1 font-mono text-xs font-bold text-[#F5D061] mb-2">
                  Tahun {m.year}
                </span>
                <h3 className="text-lg font-bold text-[#282F44] dark:text-zinc-100">
                  {m.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Filosofi Lambang */}
        <div className="rounded-3xl border border-[#E6AF2E]/30 bg-[#282F44] p-8 sm:p-12 text-white">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5D061]">
              Makna & Identitas
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              Filosofi Lambang PERISAI
            </h2>
            <div className="mt-6 space-y-4 text-sm text-zinc-300">
              <div className="flex items-start gap-3">
                <span className="text-lg">🛡️</span>
                <div>
                  <strong className="text-white">Bentuk Perisai:</strong> Melambangkan benteng integritas keilmuan, penjaga moralitas akademik, dan keteguhan memegang nilai-nilai Islam.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📖</span>
                <div>
                  <strong className="text-white">Buku, Pena & Simbol Riset:</strong> Manifestasi gairah keilmuan, tradisi membaca (Iqra), dan dedikasi menghasilkan riset bermutu tinggi.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">✨</span>
                <div>
                  <strong className="text-white">Aksen Emas & Hijau:</strong> Menyelaraskan marwah keislaman almamater Universitas Muslim Indonesia dengan kemuliaan prestasi juara.
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#3d4663] flex flex-wrap gap-4">
              <Link
                href="/tentang/visi-misi"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E6AF2E] px-5 py-2.5 text-xs font-bold text-[#282F44] hover:bg-[#F5D061] transition shadow-sm"
              >
                Lanjut ke Visi, Misi & Tujuan →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
