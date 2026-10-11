import { ContactForm } from "@/features/inbox/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak & Layanan Informasi — UKM PERISAI UMI",
  description:
    "Hubungi pengurus UKM PERISAI UMI untuk konsultasi riset ilmiah, bimbingan proposal PKM Belmawa, kerjasama kemitraan, dan informasi sekretariat.",
};

export default function KontakPage() {
  return (
    <div className="relative min-h-screen bg-[#1b1b1f] text-white selection:bg-[#FFB22C] selection:text-[#1b1b1f]">
      {/* Ambient Radial Top Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-full -translate-x-1/2 blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 0%, #FFB22C 0%, transparent 70%)",
        }}
      />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b border-white/10 pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            HUBUNGI KAMI &{" "}
            <span className="bg-gradient-to-r from-[#FFB22C] via-[#FFD700] to-[#FFA000] bg-clip-text text-transparent">
              LAYANAN INFORMASI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Pintu gerbang komunikasi resmi UKM PERISAI Universitas Muslim Indonesia untuk konsultasi riset ilmiah,
            bimbingan proposal PKM, penjajakan kolaborasi, serta kemitraan saintifik.
          </p>
        </div>
      </section>

      {/* Main Content: 2-Column Responsive Grid with Matched Heights */}
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Kolom Kiri: 1 Kotak Formulir Kontak (Tinggi Penuh) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#202026] p-6 sm:p-8 lg:p-10 shadow-2xl">
              {/* Subtle Ambient Corner Glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FFB22C]/10 blur-3xl" />

              <div>
                <div className="relative mb-6 space-y-2 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FFB22C]" />
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Formulir Pesan & Konsultasi
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Sampaikan pertanyaan, usulan riset, atau ajakan kemitraan Anda kepada pengurus UKM PERISAI UMI.
                  </p>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: 2 Kotak yang Disusun (Total Tinggi Sama dengan Kotak Kiri) */}
          <div className="lg:col-span-5 flex flex-col gap-8 h-full">
            {/* Kotak 1: Sekretariat & Lokasi Resmi */}
            <div className="relative flex-1 flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#202026] p-6 sm:p-8 shadow-xl">
              {/* Subtle Ambient Glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFB22C]/5 blur-2xl" />

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl sm:rounded-2xl bg-[#FFB22C]/10 border border-[#FFB22C]/30 flex items-center justify-center text-[#FFB22C]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Sekretariat Resmi</h3>
                    <span className="text-xs text-zinc-400">Pusat Aktivitas & Riset Fungsionaris</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed pl-1">
                  <p className="font-semibold text-white">
                    GOR UMI Ruangan No. 10
                  </p>
                  <p className="text-zinc-400">
                    Kampus II Universitas Muslim Indonesia<br />
                    Jl. Urip Sumoharjo KM 5, Panaikang, Panakkukang<br />
                    Makassar, Sulawesi Selatan 90231
                  </p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                    <span>Waktu Layanan:</span>
                    <strong className="text-white">Senin – Jumat (09.00 – 17.00 WITA)</strong>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="https://maps.google.com/?q=GOR+Universitas+Muslim+Indonesia+Makassar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-bold text-white hover:border-[#FFB22C] hover:text-[#FFB22C] hover:bg-[#FFB22C]/10 transition"
                >
                  <span>Buka Petunjuk Arah (Google Maps)</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Kotak 2: Kontak Cepat & Media */}
            <div className="relative flex-1 flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#202026] p-6 sm:p-8 shadow-xl">
              {/* Subtle Ambient Glow */}
              <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-[#FFA000]/5 blur-2xl" />

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl sm:rounded-2xl bg-[#FFB22C]/10 border border-[#FFB22C]/30 flex items-center justify-center text-[#FFB22C]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Kontak Cepat & Media</h3>
                    <span className="text-xs text-zinc-400">Saluran Komunikasi Resmi</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.529 1.761.782 2.791.782 3.182 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm3.385 8.165c-.145.407-.743.746-1.025.792-.259.043-.591.076-1.706-.385-1.425-.59-2.345-2.034-2.417-2.128-.071-.095-.572-.76-.572-1.449 0-.688.361-1.027.489-1.168.128-.142.28-.178.373-.178s.187.004.269.008c.085.004.2-.033.313.238.118.283.407.994.443 1.066.036.072.06.156.012.251-.048.096-.072.155-.143.238-.072.083-.151.186-.216.25-.072.072-.147.151-.063.295.084.144.373.615.801.996.551.49 1.016.642 1.16.714.144.072.228.06.313-.036.084-.096.361-.42.457-.564.096-.144.192-.12.325-.072.132.048.841.396.985.468.144.072.24.108.276.168.036.06.036.348-.109.755z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                          WhatsApp Hotline
                        </div>
                        <div className="text-[11px] text-zinc-400">+62 812-3456-7890</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">Chat →</span>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:ukmperisai@umi.ac.id"
                    className="flex items-center justify-between p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-[#FFB22C]/40 hover:bg-[#FFB22C]/10 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#FFB22C]/10 border border-[#FFB22C]/30 flex items-center justify-center text-[#FFB22C] shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#FFB22C] transition">
                          Email Resmi
                        </div>
                        <div className="text-[11px] text-zinc-400">ukmperisai@umi.ac.id</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#FFB22C]">Kirim →</span>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/ukmperisai_umi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-[#FFB22C]/40 hover:bg-[#FFB22C]/10 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#FFB22C]/10 border border-[#FFB22C]/30 flex items-center justify-center text-[#FFB22C] shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2} />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#FFB22C] transition">
                          Instagram Resmi
                        </div>
                        <div className="text-[11px] text-zinc-400">@ukmperisai_umi</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#FFB22C]">Buka ↗</span>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@ukmperisaiumi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-[#FFB22C]/40 hover:bg-[#FFB22C]/10 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#FFB22C]/10 border border-[#FFB22C]/30 flex items-center justify-center text-[#FFB22C] shrink-0">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#FFB22C] transition">
                          YouTube Channel
                        </div>
                        <div className="text-[11px] text-zinc-400">@ukmperisaiumi</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#FFB22C]">Tonton ↗</span>
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-center text-[11px] text-zinc-400 gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Rata-rata respon pengurus dalam 1x24 jam kerja</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
