import { getAdminGallery } from "@/features/gallery/queries.admin";
import { GalleryUploader } from "@/features/gallery/components/GalleryUploader";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { deleteMediaAction } from "@/features/gallery/actions";
import Image from "next/image";
import Link from "next/link";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminGallery({ page, pageSize: 10 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Galeri & Media Manager
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Pusat pengelolaan seluruh berkas gambar dan dokumentasi organisasi.
        </p>
      </div>

      {/* Komponen Unggah Banyak File */}
      <GalleryUploader />

      {/* Grid Media Terdaftar */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>Berkas Media Tersimpan</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-mono text-zinc-400">
            {data.total}
          </span>
        </h2>

        {data.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#202026] p-12 text-center text-zinc-400">
            Belum ada berkas media di sistem.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.items.map((media) => (
              <div
                key={media.id}
                className="group relative rounded-2xl border border-white/10 bg-[#202026] p-3 shadow-lg transition-all hover:border-[#FFB22C]/40 flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-[#16161a]">
                  {media.mimeType?.startsWith("image/") ? (
                    <Image
                      src={media.url}
                      alt={media.originalName || "Media"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-mono text-zinc-400">
                      FILE
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="truncate text-xs font-semibold text-white" title={media.originalName || "Media"}>
                    {media.originalName || "Berkas Media"}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <Link
                      href={`/admin/gallery/${media.id}`}
                      className="text-[#FFB22C] font-semibold hover:text-[#FFA000] transition-colors"
                    >
                      Detail
                    </Link>
                    <ConfirmDelete
                      onConfirm={async () => {
                        "use server";
                        await deleteMediaAction(media.id);
                      }}
                      title="Hapus Media"
                      description={`Hapus berkas "${media.originalName || "ini"}"?`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          createPageUrl={(p) => `/admin/gallery?page=${p}`}
        />
      </div>
    </div>
  );
}
