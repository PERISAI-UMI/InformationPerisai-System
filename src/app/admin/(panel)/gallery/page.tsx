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
  const data = await getAdminGallery({ page, pageSize: 20 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Galeri & Media Manager
        </h1>
        <p className="text-sm text-zinc-500">
          Pusat pengelolaan seluruh berkas gambar dan dokumentasi organisasi.
        </p>
      </div>

      {/* Komponen Unggah Banyak File */}
      <GalleryUploader />

      {/* Grid Media Terdaftar */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Berkas Media Tersimpan ({data.total})
        </h2>

        {data.items.length === 0 ? (
          <p className="text-sm text-zinc-500">Belum ada berkas media di sistem.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.items.map((media) => (
              <div
                key={media.id}
                className="group relative rounded-xl border border-zinc-200 bg-white p-2 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {media.mimeType.startsWith("image/") ? (
                    <Image
                      src={media.url}
                      alt={media.originalName || "Media"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-mono">
                      FILE
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100" title={media.originalName || "Media"}>
                    {media.originalName || "Berkas Media"}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <Link
                      href={`/admin/gallery/${media.id}`}
                      className="text-[#E6AF2E] font-medium hover:underline"
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
