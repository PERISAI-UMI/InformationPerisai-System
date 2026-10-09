import { notFound } from "next/navigation";
import { getPublicOpportunityBySlug } from "@/features/opportunities/queries.public";
import { getOpportunityStatusLabel } from "@/features/opportunities/status";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { SafeHtml } from "@/components/common/SafeHtml";
import { Badge } from "@/components/ui/Badge";
import { formatDateIndonesian, formatDateTimeWITA } from "@/lib/dates";
import Link from "next/link";

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

  const statusInfo = getOpportunityStatusLabel(opp.deadlineAt);

  return (
    <article className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/peluang"
            className="text-xs font-bold text-[#E6AF2E] hover:text-[#b8861b]"
          >
            ← Kembali ke Daftar Peluang
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge variant="primary">{opp.category}</Badge>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-[#282F44] dark:text-zinc-100 leading-tight">
            {opp.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Diselenggarakan oleh: <strong className="text-zinc-700 dark:text-zinc-300">{opp.organizer}</strong>
          </p>
        </div>

        {opp.coverImageUrl && (
          <ResponsiveImage
            src={opp.coverImageUrl}
            alt={opp.title}
            aspectRatio="banner"
            className="rounded-2xl"
          />
        )}

        {/* Informasi Tenggat & Tautan */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[#E6AF2E]/40 bg-[#E6AF2E]/10 p-5 dark:border-[#E6AF2E]/30 dark:bg-[#E6AF2E]/10">
          <div>
            <p className="text-xs font-bold uppercase text-[#282F44] dark:text-[#F5D061]">
              Batas Akhir Pendaftaran (Deadline)
            </p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {opp.deadlineAt
                ? `${formatDateTimeWITA(opp.deadlineAt)} (${formatDateIndonesian(opp.deadlineAt)})`
                : "Terbuka hingga diumumkan lebih lanjut"}
            </p>
          </div>
          {opp.registrationUrl && (
            <a
              href={opp.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-5 py-2.5 text-sm font-bold text-[#282F44] shadow-sm hover:bg-[#F5D061] transition"
            >
              Daftar Sekarang ↗
            </a>
          )}
        </div>

        <div className="space-y-6 pt-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Deskripsi Peluang
          </h2>
          <SafeHtml html={opp.description} />
        </div>
      </div>
    </article>
  );
}
