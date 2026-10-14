import { GOLD, Sparkle } from "./visuals";

export function PerisaiStoreSection() {
  return (
    <section className="relative pb-24 pt-4">
      <Sparkle className="left-[5%] top-12 hidden md:block" size={26} delay={0.5} float />
      <Sparkle className="right-[5%] top-20 hidden md:block" size={22} delay={1.2} />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-2xl relative overflow-hidden rounded-3xl border border-[#FFB22C]/40 bg-gradient-to-b from-[#26262e] via-[#1f1f25] to-[#161619] p-8 sm:p-10 text-center shadow-2xl">
          {/* Ambient Radiant Lights */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FFB22C]/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#FFA000]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center space-y-4">
            {/* Badge Atas */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB22C]/40 bg-[#FFB22C]/10 px-4 py-1 text-xs font-bold text-[#FFB22C] shadow-[0_0_15px_rgba(255,178,44,0.15)]">
              <span>✦</span>
              <span className="tracking-widest uppercase">OFFICIAL STORE & MERCHANDISE</span>
              <span>✦</span>
            </div>

            {/* Judul Emas */}
            <h2
              className="text-3xl font-extrabold uppercase sm:text-4xl lg:text-5xl"
              style={{ color: GOLD }}
            >
              Perisai Store
            </h2>

            {/* Tombol CTA Elegan */}
            <div className="pt-2">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Admin%20PERISAI%20Store,%20saya%20tertarik%20dengan%20katalog%20merchandise%20resmi!"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center rounded-full px-8 py-3 text-xs sm:text-sm font-bold text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/25 transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #FFC85A 0%, #FFB22C 50%, #FFA000 100%)",
                }}
              >
                <span>Kunjungi PERISAI Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
