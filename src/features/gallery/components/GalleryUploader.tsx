"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

import { toast } from "@/components/ui/Toast";

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
    let failed = 0;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          completed++;
        } else {
          failed++;
        }
        setUploadProgress(`Mengunggah ${completed + failed} dari ${files.length} berkas...`);
      } catch (err) {
        failed++;
        console.error("Gagal mengunggah berkas:", files[i].name, err);
      }
    }

    setIsUploading(false);
    setUploadProgress("");

    if (completed > 0) {
      toast.success(`${completed} berkas foto berhasil diunggah ke galeri.`);
      router.refresh();
    }
    if (failed > 0) {
      toast.error(`${failed} berkas gagal diunggah. Pastikan format gambar sesuai.`);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-white/10 p-8 text-center bg-[#202026] hover:border-[#FFB22C]/40 transition-colors">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFB22C]/10 text-[#FFB22C] border border-[#FFB22C]/20 shadow-inner">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <h4 className="text-base font-bold text-white">
          Unggah Media & Dokumentasi
        </h4>
        <p className="text-xs text-zinc-400 max-w-sm">
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
          <Button
            type="button"
            variant="primary"
            size="md"
            isLoading={isUploading}
            className="whitespace-nowrap px-5 gap-2 shadow-md"
          >
            {!isUploading && (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
            <span>{isUploading ? uploadProgress : "Pilih Berkas dari Komputer"}</span>
          </Button>
        </label>
      </div>
    </div>
  );
}
