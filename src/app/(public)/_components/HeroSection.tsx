import Image from "next/image";
import Link from "next/link";
import { GOLD, Sparkle } from "./visuals";

export function HeroSection() {
  return (
    <section className="relative pb-6 pt-10 sm:pt-16">
      <Sparkle className="right-[42%] top-12 hidden lg:block" size={34} delay={0.4} float />
      <Sparkle className="right-[3%] top-8" size={30} delay={1.1} float />
      <Sparkle className="right-[8%] top-[24rem] hidden sm:block" size={20} delay={0.7} />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 xl:gap-14">
          {/* Kiri: teks (rata tengah di mobile, rata kiri di desktop) */}
          <div className="space-y-3 text-center lg:col-span-7 lg:text-left">
            <p className="text-base font-bold uppercase tracking-wider sm:text-lg lg:text-xl">
              Unit Kegiatan Mahasiswa
            </p>
            <h1
              className="text-4xl font-bold uppercase leading-[1.08] sm:text-6xl lg:text-7xl xl:text-[4.75rem]"
              style={{ color: GOLD }}
            >
              Pusat Pengembangan
              <br />
              Riset Mahasiswa
            </h1>
            <h2 className="text-lg font-bold uppercase sm:text-2xl lg:text-3xl">
              Universitas Muslim Indonesia
            </h2>
            <p className="mx-auto max-w-2xl pt-6 text-center text-sm leading-relaxed text-zinc-200 sm:pt-8 sm:text-lg lg:text-xl lg:mx-0 lg:text-left">
              UKM Perisai (Pusat Pengembangan Riset Mahasiswa) adalah wadah mahasiswa untuk
              berinovasi dan berkolaborasi dalam berbagai bidang.
            </p>
            <div className="flex justify-center pt-4 lg:justify-start">
              <Link
                href="/kontak"
                className="inline-block rounded-xl px-8 py-3 text-base sm:text-lg font-bold text-[#1b1b1f] shadow-[0_4px_0_#b57a10] transition hover:-translate-y-0.5 hover:brightness-110"
                style={{ background: GOLD }}
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Kanan: maskot + glow (disembunyikan di mobile, hanya muncul di desktop) */}
          <div className="relative hidden justify-center lg:col-span-5 lg:flex">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[30rem] sm:w-[30rem] lg:h-[36rem] lg:w-[36rem]"
              style={{ background: `${GOLD}66`, animation: "pr-glow 5s ease-in-out infinite" }}
            />
            <Image
              src="/maskot.png"
              alt="Fungsionaris UKM PERISAI UMI"
              width={550}
              height={720}
              priority
              className="relative h-80 w-auto object-contain drop-shadow-2xl sm:h-[460px] lg:h-[540px] xl:h-[600px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
