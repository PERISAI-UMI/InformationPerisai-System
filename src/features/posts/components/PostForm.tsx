"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { MediaPicker } from "@/components/common/MediaPicker";
import { createPostAction, updatePostAction } from "../actions";

export interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    slug?: string;
    content: string;
    excerpt?: string | null;
    coverImageUrl?: string | null;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  };
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    initialData?.status || "DRAFT"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      title,
      slug: slug || undefined,
      content,
      excerpt: excerpt || undefined,
      coverImageUrl: coverImageUrl || undefined,
      status,
    };

    const res = initialData?.id
      ? await updatePostAction(initialData.id, payload)
      : await createPostAction(payload);

    setIsLoading(false);

    if (res.success) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      setErrorMessage(res.message || "Gagal menyimpan postingan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {errorMessage && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Input
            label="Judul Berita / Postingan *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Masukkan judul postingan..."
          />

          <Input
            label="Kustom Slug (Opsional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="biarkan kosong untuk membuat otomatis dari judul"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Ringkasan Singkat (Excerpt)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Deskripsi singkat untuk cuplikan kartu dan SEO..."
            />
          </div>

          <RichTextEditor
            label="Isi Konten *"
            value={content}
            onChange={setContent}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Pengaturan Publikasi
            </h4>

            <Select
              label="Status Postingan"
              value={status}
              onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED")}
              options={[
                { label: "Draft (Konsep)", value: "DRAFT" },
                { label: "Publikasikan (Published)", value: "PUBLISHED" },
                { label: "Arsipkan (Archived)", value: "ARCHIVED" },
              ]}
            />

            <MediaPicker
              label="Gambar Utama (Cover)"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
            />

            <Button type="submit" variant="primary" className="w-full mt-4" isLoading={isLoading}>
              {initialData?.id ? "Simpan Perubahan" : "Terbitkan Postingan"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
