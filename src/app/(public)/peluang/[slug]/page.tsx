import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPublicOpportunityBySlug } from "@/features/opportunities/queries.public";
import { SafeHtml } from "@/components/common/SafeHtml";
import { formatDateIndonesian, formatDateTimeWITA } from "@/lib/dates";
import { OpportunityCard } from "@/features/opportunities/components/OpportunityCard";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const opp = await getPublicOpportunityBySlug(slug);

  if (!opp) {
    return { title: "Peluang Tidak Ditemukan — UKM PERISAI UMI" };
  }

  return {
    title: `${opp.title} — UKM PERISAI UMI`,
    description: `Informasi perlombaan dan beasiswa: ${opp.title} diselenggarakan oleh ${opp.organizer}.`,
  };
}

export default async function PeluangDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opp = await getPublicOpportunityBySlug(slug);

  if (!opp) {
    notFound();
  }

  const coverImage = opp.coverImageUrl || "/og-default.webp";
  const isOpen = opp.isOpen ?? true;
  const daysLeft = opp.daysLeft;

  return (
    <div className="relative min-h-screen bg-[#1b1b1f] text-white selection:bg-[#FFB22C] selection:text-[#1b1b1f]">
      {/* Ambient Top Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-3/4 -translate-x-1/2 blur-3xl opacity-25"
        style={{
          background: "radial-gradient(circle at 50% 0%, #FFB22C 0%, transparent 70%)",
        }}
      />

      <article className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/competition"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-bold text-[#FFB22C] backdrop-blur-sm transition hover:border-[#FFB22C]/40 hover:bg-[#FFB22C]/10"
          >
            <span>←</span>
            <span>Kembali ke Competition</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#FFB22C]/30 bg-[#FFB22C]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFB22C]">
              {opp.type}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
              {opp.category}
            </span>
          </div>
        </div>

        {/* Header Title & Penyelenggara */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {!isOpen ? (
              <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-400">
                Pendaftaran Ditutup
              </span>
            ) : daysLeft !== null && daysLeft <= 7 ? (
              <span className="rounded-full border border-red-500/50 bg-red-950/80 px-3 py-1 text-xs font-bold text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse">
                ⏰ Sisa {daysLeft} Hari Lagi!
              </span>
            ) : (
              <span className="rounded-full border border-emerald-500/40 bg-emerald-950/80 px-3 py-1 text-xs font-bold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                ● Pendaftaran Terbuka {daysLeft !== null ? `(Sisa ${daysLeft} Hari)` : ""}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black leading-tight text-white tracking-tight">
            {opp.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Diselenggarakan resmi oleh:</span>
            <strong className="text-white font-bold">{opp.organizer}</strong>
          </div>
        </header>

        {/* Poster Banner Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-zinc-900">
          <Image
            src={coverImage}
            alt={opp.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Deadline & Registration Action Box */}
        <div className="relative overflow-hidden rounded-3xl border border-[#FFB22C]/40 bg-gradient-to-r from-[#2b2b31] via-[#24242a] to-[#1c1c20] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFB22C]">
                Batas Akhir Pendaftaran (Deadline WITA)
              </span>
              <p className="text-xl sm:text-2xl font-black text-white">
                {opp.deadlineAt
                  ? `${formatDateTimeWITA(opp.deadlineAt)} (${formatDateIndonesian(opp.deadlineAt)})`
                  : "Terbuka hingga kuota tim terpenuhi"}
              </p>
              {daysLeft !== null && isOpen && (
                <p className="text-xs text-zinc-400">
                  Segera persiapkan proposal Anda, batas registrasi berakhir dalam <strong className="text-emerald-400">{daysLeft} hari ke depan</strong>.
                </p>
              )}
            </div>

            {opp.registrationUrl && isOpen && (
              <a
                href={opp.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-7 py-3.5 text-sm font-black text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 hover:scale-[1.02] transition-all"
              >
                <span>Daftar Sekarang</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Description Body */}
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-3">
            Panduan & Informasi Kompetisi
          </h2>

          <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed space-y-6 prose-headings:text-white prose-headings:font-bold prose-a:text-[#FFB22C] prose-a:underline hover:prose-a:text-[#FFC85A] prose-blockquote:border-[#FFB22C] prose-strong:text-white">
            <SafeHtml html={opp.description} />
          </div>
        </div>

        {/* Narahubung Callout */}
        <div className="rounded-2xl border border-white/10 bg-[#222228] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Butuh Bimbingan atau Review Proposal?</h4>
            <p className="text-xs text-zinc-400">
              Pengurus Divisi Kompetisi & Prestasi (Kompres) UKM PERISAI UMI siap memfasilitasi pendampingan karya dan dosen pembimbing.
            </p>
          </div>
          <Link
            href="/kontak"
            className="shrink-0 rounded-xl border border-[#FFB22C]/40 bg-[#FFB22C]/10 px-5 py-2.5 text-xs font-bold text-[#FFB22C] hover:bg-[#FFB22C] hover:text-[#1b1b1f] transition"
          >
            Hubungi Pengurus →
          </Link>
        </div>

        {/* Related Opportunities Section */}
        {opp.relatedOpportunities && opp.relatedOpportunities.length > 0 && (
          <section className="border-t border-white/10 pt-12 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Peluang Serupa Lainnya</h3>
                <p className="text-xs text-zinc-400 mt-1">Eksplorasi pilihan kompetisi dan beasiswa berikutnya</p>
              </div>
              <Link href="/competition" className="text-xs font-bold text-[#FFB22C] hover:underline">
                Lihat Semua Peluang →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opp.relatedOpportunities.map((related) => (
                <OpportunityCard key={related.id} opportunity={related} hrefPrefix="/competition" />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
