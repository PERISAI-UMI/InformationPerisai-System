import { notFound } from "next/navigation";
import { getAdminMediaById } from "@/features/gallery/queries.admin";
import { formatDateTimeWITA } from "@/lib/dates";
import Link from "next/link";
import Image from "next/image";

export default async function AdminMediaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const media = await getAdminMediaById(id);

  if (!media) {
    notFound();
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div>
        <Link
          href="/admin/gallery"
          className="text-xs font-semibold text-[#FFB22C] hover:text-[#FFA000] transition-colors"
        >
          ← Kembali ke Galeri
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Rincian Berkas Media
        </h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#202026] p-6 shadow-xl space-y-6">
        <div className="relative aspect-video max-h-96 overflow-hidden rounded-xl bg-[#16161a] border border-white/5">
          <Image
            src={media.url}
            alt={media.originalName || "Media"}
            fill
            className="object-contain"
          />
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Nama Asli Berkas</dt>
            <dd className="mt-1 font-semibold text-white">{media.originalName || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Ukuran Berkas</dt>
            <dd className="mt-1 font-mono text-zinc-300">
              {(media.size / 1024).toFixed(1)} KB
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tipe MIME</dt>
            <dd className="mt-1 font-mono text-zinc-300">{media.mimeType}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Waktu Diunggah</dt>
            <dd className="mt-1 text-zinc-300">{formatDateTimeWITA(new Date(media.createdAt * 1000))}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">URL Akses Publik</dt>
            <dd className="mt-1 font-mono text-xs text-[#FFB22C] font-semibold break-all select-all p-2.5 rounded-lg bg-[#16161a] border border-white/10">
              {media.url}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
