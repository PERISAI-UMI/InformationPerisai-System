import Image from "next/image";
import Link from "next/link";
import { getPublicActiveMembers } from "@/features/members/queries.public";
import { getPublicSettings } from "@/features/settings/queries.public";
import { OrganogramChart } from "@/features/members/components/OrganogramChart";
import { AboutNavTabs } from "@/features/about/components/AboutNavTabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struktur Organisasi — UKM PERISAI UMI",
  description:
    "Bagan hierarki struktural kepengurusan, penjelasan pembina, BPH, dan direktori 42 pengurus aktif UKM PERISAI Universitas Muslim Indonesia.",
};

export default async function StrukturPage() {
  const [members, settings] = await Promise.all([
    getPublicActiveMembers(),
    getPublicSettings(),
  ]);

  const currentGen = settings.current_generasi || "11";

  const structuralPoints = [
    {
      no: "1",
      title: "Komposisi Lembaga",
      desc: "Struktur PERISAI UMI terdiri dari: Pembina, Dewan Pertimbangan Organisasi, pengurus inti dan staf ahli.",
    },
    {
      no: "2",
      title: "Dewan Pembina",
      desc: "Pembina adalah orang yang diamanahkan oleh birokrasi dalam hal ini Wakil Rektor III Universitas Muslim Indonesia.",
    },
    {
      no: "3",
      title: "Dewan Pertimbangan Organisasi",
      desc: "Dewan Pertimbangan Organisasi adalah demisioner PERISAI UMI yang berjumlah 7 orang.",
    },
    {
      no: "4",
      title: "Pengurus Inti",
      desc: "Pengurus inti meliputi Ketua, Sekretaris, Bendahara dan Kepala Departemen.",
    },
    {
      no: "5",
      title: "Staf Ahli",
      desc: "Staf Ahli adalah semua pengurus selain pengurus inti.",
    },
    {
      no: "6",
      title: "Anggota Biasa",
      desc: "Anggota biasa adalah generasi baru PERISAI UMI.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1b1b1f] text-[#ECECEC] pb-24">
      {/* ======================================================== */}
      {/* 1. HERO HEADER WITH CAMPUS IMAGE OVERLAY                 */}
      {/* ======================================================== */}
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
            style={{
              textShadow: "0 4px 30px rgba(255, 178, 44, 0.45)",
            }}
          >
            STRUKTUR ORGANISASI
          </h1>
          <p className="mt-2 text-base sm:text-xl md:text-2xl font-black uppercase tracking-widest text-white drop-shadow-md">
            PUSAT PENGEMBANGAN RISET MAHASISWA
          </p>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-medium">
            Formasi Kepengurusan Periode Aktif 2026/2027 — Generasi {currentGen} Inovator Muda Universitas Muslim Indonesia
          </p>

          {/* Subpage Nav Tabs */}
          <div className="mt-8 flex justify-center">
            <AboutNavTabs />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PENJELASAN STRUKTUR (POIN 1 S/D 6 SESUAI MOCKUP)      */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="rounded-3xl border border-[#FFB22C]/20 bg-[#2b2b31]/80 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="rounded-md bg-[#FFB22C] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1b1b1f]">
                Ketentuan & Tata Kelola
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                Pedoman Struktur Kepengurusan PERISAI UMI
              </h2>
            </div>
            <span className="hidden sm:inline-block rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-400 font-bold">
              6 Poin Hirarki
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {structuralPoints.map((item) => (
              <div
                key={item.no}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 transition-all hover:border-[#FFB22C]/40 hover:bg-white/10"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFB22C] text-sm font-black text-[#1b1b1f] shadow-md">
                  {item.no}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. BAGAN ORGANOGRAM & DIREKTORI 42 PENGURUS RIIL         */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <OrganogramChart members={members as any} />
      </section>

      {/* ======================================================== */}
      {/* 4. FOOTER BANNER                                         */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="rounded-3xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#2b2b31] via-[#222228] to-[#1b1b1f] p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Ingin Mengetahui Sarana & Fasilitas Riset?</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Pelajari inventaris sekretariat, sarana laboratorium, dan repositori karya ilmiah yang disediakan bagi seluruh fungsionaris.
            </p>
          </div>
          <Link
            href="/tentang/sumber-daya"
            className="rounded-xl bg-[#FFB22C] px-6 py-2.5 text-xs font-black text-[#1b1b1f] hover:bg-[#FFC85A] transition shadow-[0_0_15px_rgba(255,178,44,0.3)] whitespace-nowrap"
          >
            Lihat Sumber Daya & Fasilitas →
          </Link>
        </div>
      </section>
    </div>
  );
}
