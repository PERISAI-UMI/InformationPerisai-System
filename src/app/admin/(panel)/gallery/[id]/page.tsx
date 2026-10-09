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
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href="/admin/gallery"
          className="text-xs font-bold text-[#E6AF2E] hover:text-[#b8861b]"
        >
          ← Kembali ke Galeri
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Rincian Berkas Media
        </h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
        <div className="relative aspect-video max-h-96 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={media.url}
            alt={media.originalName || "Media"}
            fill
            className="object-contain"
          />
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs text-zinc-400">Nama Asli Berkas</dt>
            <dd className="font-semibold text-zinc-900 dark:text-zinc-100">{media.originalName || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-400">Ukuran Berkas</dt>
            <dd className="font-mono text-zinc-700 dark:text-zinc-300">
              {(media.size / 1024).toFixed(1)} KB
            </dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-400">Tipe MIME</dt>
            <dd className="font-mono text-zinc-700 dark:text-zinc-300">{media.mimeType}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-400">Waktu Diunggah</dt>
            <dd className="text-zinc-700 dark:text-zinc-300">{formatDateTimeWITA(new Date(media.createdAt * 1000))}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-zinc-400">URL Akses Publik</dt>
            <dd className="font-mono text-xs text-[#E6AF2E] font-medium break-all select-all mt-0.5">
              {media.url}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
