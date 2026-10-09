import { ContactForm } from "@/features/inbox/components/ContactForm";

export default function KontakPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E6AF2E]">
            Hubungi Kami
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[#282F44] dark:text-zinc-100">
            Kirimkan Pesan Anda
          </h1>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Punya pertanyaan mengenai UKM PERISAI UMI, penjajakan kolaborasi riset, atau pendaftaran anggota baru? Silakan hubungi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Form Kontak */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
            <h3 className="text-xl font-bold text-[#282F44] dark:text-zinc-100 mb-6">
              Formulir Kontak
            </h3>
            <ContactForm />
          </div>

          {/* Informasi Kontak & Lokasi */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-lg font-bold text-[#282F44] dark:text-zinc-100 mb-4">
                📍 Sekretariat Organisasi
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Gedung Menara UMI Lt. 4 / Ruang PKM UKM PERISAI UMI<br />
                Universitas Muslim Indonesia<br />
                Jl. Urip Sumoharjo KM. 5, Panaikang, Panakkukang<br />
                Makassar, Sulawesi Selatan 90231
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-lg font-bold text-[#282F44] dark:text-zinc-100 mb-4">
                📱 Media Komunikasi
              </h3>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <strong>Email Resmi:</strong> <a href="mailto:kontak@perisai-umi.org" className="text-[#E6AF2E] font-semibold hover:underline">kontak@perisai-umi.org</a>
                </li>
                <li>
                  <strong>Instagram:</strong> <a href="https://instagram.com/perisaiumi" target="_blank" rel="noopener noreferrer" className="text-[#E6AF2E] font-semibold hover:underline">@perisaiumi</a>
                </li>
                <li>
                  <strong>Layanan Informasi:</strong> Setiap hari kerja (09.00 - 17.00 WITA)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
