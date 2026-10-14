import Image from "next/image";
import Link from "next/link";
import { GOLD, Sparkle } from "./visuals";

interface FocusProgramSectionProps {
  featuredProker: {
    id: string;
    name: string;
    slug: string;
    summary?: string | null;
    description?: string;
    status: string;
    coverImageUrl?: string | null;
  };
  prokerDescription: string;
}

export function FocusProgramSection({
  featuredProker,
  prokerDescription,
}: FocusProgramSectionProps) {
  return (
    <section className="relative pb-10 pt-4 sm:pb-14">
      <Sparkle className="left-[6%] top-24 hidden md:block" size={22} delay={0.9} />
      <div className="mx-auto max-w-[1440px] space-y-12 px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header seksi: judul di mobile & desktop; subjudul header di desktop */}
        <div className="mx-auto max-w-4xl space-y-3 text-center">
          <h2 className="text-4xl font-bold sm:text-5xl lg:text-6xl" style={{ color: GOLD }}>
            Program Kerja Kami
          </h2>
          <p className="hidden text-base leading-relaxed text-zinc-100 sm:text-lg lg:text-xl lg:block">
            UKM Perisai (Pusat Pengembangan Riset Mahasiswa) memiliki beberapa program kerja
            sebagai penunjang mahasiswa inovatif
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Kiri: poster bertumpuk, Pelajari Selengkapnya, dan caption header pada mobile */}
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <div className="relative pl-12 sm:pl-16">
              {/* Kontainer stack kartu: tinggi terkunci sama persis dengan poster */}
              <div className="relative w-64 sm:w-76 lg:w-80 xl:w-88">
                {/* Kartu-kartu belakang */}
                {[40, 26, 13].map((offset, i) => (
                  <div
                    key={offset}
                    aria-hidden
                    className="absolute inset-y-0 w-full rounded-2xl border-2"
                    style={{
                      left: `-${offset}px`,
                      borderColor: `${GOLD}77`,
                      background: "#202026",
                      opacity: 0.5 + i * 0.2,
                    }}
                  />
                ))}

                {/* Poster utama: Default Obsidian Gold Card jika tidak ada cover khusus */}
                {featuredProker.coverImageUrl && !featuredProker.coverImageUrl.includes("og-default") ? (
                  <div
                    className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-[3px] shadow-2xl"
                    style={{ borderColor: GOLD }}
                  >
                    <Image
                      src={featuredProker.coverImageUrl}
                      alt={featuredProker.name}
                      fill
                      sizes="(max-width: 640px) 256px, (max-width: 1024px) 304px, 352px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div
                    className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-[3px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between text-center bg-gradient-to-br from-[#292931] via-[#202026] to-[#161619]"
                    style={{ borderColor: GOLD }}
                  >
                    {/* Ambient Glows */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#FFB22C]/15 blur-2xl" />
                    <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-[#FFA000]/10 blur-2xl" />

                    {/* Header Tag */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span
                        className="rounded-full px-3 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest backdrop-blur-md"
                        style={{
                          background: "rgba(27, 27, 31, 0.85)",
                          color: GOLD,
                          border: `1px solid ${GOLD}66`,
                        }}
                      >
                        ✦ PROGRAM UNGGULAN ✦
                      </span>
                      <span className="text-xs text-[#FFB22C] font-bold">2026</span>
                    </div>

                    {/* Center Emblem: Futuristic Gold Shield Box & Title */}
                    <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2">
                      <div className="relative mb-3 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl border border-[#FFB22C]/40 bg-[#FFB22C]/10 shadow-[0_0_25px_rgba(255,178,44,0.25)] backdrop-blur-md transition-transform duration-300 hover:scale-105">
                        <Image
                          src="/logoperisaii.webp"
                          alt="Logo PERISAI UMI"
                          width={64}
                          height={64}
                          className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FFB22C]">
                        UKM PERISAI UMI
                      </span>
                      <h4 className="mt-1 text-lg sm:text-xl font-black text-white line-clamp-2 leading-tight">
                        {featuredProker.name}
                      </h4>
                    </div>

                    {/* Bottom Footer Info */}
                    <div className="relative z-10 border-t border-white/10 pt-3">
                      <p className="text-[10px] sm:text-xs text-zinc-300 font-medium">
                        Pusat Pengembangan Riset Mahasiswa
                      </p>
                      <div className="mt-1 flex items-center justify-center gap-2 text-[10px] font-bold text-[#FFB22C]">
                        <span>Inovasi</span>
                        <span>•</span>
                        <span>Penelitian</span>
                        <span>•</span>
                        <span>Prestasi</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tombol panah di sisi kiri poster utama */}
                <button
                  type="button"
                  aria-label="Program sebelumnya"
                  className="absolute -left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#1b1b1f] text-xl font-bold shadow-lg ring-2 ring-white transition hover:scale-110"
                  style={{ color: GOLD }}
                >
                  ←
                </button>
              </div>

              {/* Tautan Pelajari Selengkapnya PAS persis di bawah gambar poster */}
              <div className="mt-5 w-64 text-center sm:w-76 lg:w-80 xl:w-88">
                <Link
                  href="/tentang/sumber-daya#proker"
                  className="inline-flex items-center gap-2 text-base font-bold underline underline-offset-4 transition hover:brightness-125"
                  style={{ color: GOLD }}
                >
                  Pelajari Selengkapnya <span>→</span>
                </Link>
              </div>
            </div>

            {/* Caption header pada tampilan mobile: tampil tepat setelah gambar */}
            <p className="mx-auto max-w-sm pt-6 text-center text-sm leading-relaxed text-zinc-100 lg:hidden">
              UKM Perisai (Pusat Pengembangan Riset Mahasiswa) memiliki beberapa program kerja
              sebagai penunjang mahasiswa inovatif
            </p>
          </div>

          {/* Kanan: kotak penjelasan program (dihilangkan di mobile, tetap ada di desktop) */}
          <div
            className="relative hidden rounded-3xl border-[3px] p-8 sm:p-10 lg:col-span-7 lg:block lg:p-12 shadow-2xl"
            style={{ borderColor: GOLD }}
          >
            <h3 className="text-3xl font-bold sm:text-4xl lg:text-5xl" style={{ color: GOLD }}>
              {featuredProker.name}
            </h3>
            <p className="mt-3 text-xl sm:text-2xl font-semibold">
              Salam Inovator
            </p>
            <p className="mt-6 whitespace-pre-line text-base sm:text-lg leading-relaxed text-zinc-100">
              {prokerDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
