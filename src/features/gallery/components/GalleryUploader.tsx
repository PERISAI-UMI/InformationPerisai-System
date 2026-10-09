"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function GalleryUploader() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Mengunggah 0 dari ${files.length} berkas...`);

    let completed = 0;
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        await fetch("/api/media", {
          method: "POST",
          body: formData,
        });
        completed++;
        setUploadProgress(`Mengunggah ${completed} dari ${files.length} berkas...`);
      } catch (err) {
        console.error("Gagal mengunggah berkas:", files[i].name, err);
      }
    }

    setIsUploading(false);
    setUploadProgress("");
    router.refresh();
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">📁</span>
        <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Unggah Banyak Berkas Sekaligus
        </h4>
        <p className="text-xs text-zinc-500 max-w-sm">
          Pilih satu atau beberapa berkas foto/gambar untuk ditambahkan ke galeri media UKM PERISAI UMI.
        </p>

        <label className="cursor-pointer mt-2">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleMultipleUpload}
            disabled={isUploading}
          />
          <Button type="button" variant="primary" size="md" isLoading={isUploading}>
            {isUploading ? uploadProgress : "Pilih Berkas dari Komputer"}
          </Button>
        </label>
      </div>
    </div>
  );
}
