"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import dynamic from "next/dynamic";
import { MediaPicker } from "@/components/common/MediaPicker";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-xl border border-white/10 bg-zinc-800/40" />
    ),
  }
);
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";
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
      toast.success(initialData?.id ? "Postingan berhasil diperbarui!" : "Postingan baru berhasil dibuat!");
      router.push("/admin/posts");
      router.refresh();
    } else {
      const msg = res.message || "Gagal menyimpan postingan.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {errorMessage && (
        <div className="animate-shake">
          <Alert variant="error" title="Gagal Menyimpan" onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
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

          <Textarea
            label="Ringkasan Singkat (Excerpt)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="Deskripsi singkat untuk cuplikan kartu dan SEO..."
          />

          <RichTextEditor
            label="Isi Konten *"
            value={content}
            onChange={setContent}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#202026] p-5 shadow-lg space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
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
