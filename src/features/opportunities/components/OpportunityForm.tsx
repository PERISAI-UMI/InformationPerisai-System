"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/common/MediaPicker";
import { createOpportunityAction, updateOpportunityAction } from "../actions";

export interface OpportunityFormProps {
  initialData?: {
    id: string;
    title: string;
    slug?: string;
    organizer: string;
    description: string;
    requirements?: string | null;
    linkUrl?: string | null;
    deadlineAt: string;
    category: "LOMBA" | "BEASISWA" | "SEMINAR" | "MAGANG";
    coverImageUrl?: string | null;
  };
}

export function OpportunityForm({ initialData }: OpportunityFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [organizer, setOrganizer] = useState(initialData?.organizer || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [requirements, setRequirements] = useState(initialData?.requirements || "");
  const [linkUrl, setLinkUrl] = useState(initialData?.linkUrl || "");
  const [deadlineAt, setDeadlineAt] = useState(
    initialData?.deadlineAt ? initialData.deadlineAt.split("T")[0] : ""
  );
  const [category, setCategory] = useState<"LOMBA" | "BEASISWA" | "SEMINAR" | "MAGANG">(
    initialData?.category || "LOMBA"
  );
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      title,
      slug: slug || undefined,
      organizer,
      description,
      requirements: requirements || undefined,
      linkUrl: linkUrl || undefined,
      deadlineAt: new Date(deadlineAt).toISOString(),
      category,
      coverImageUrl: coverImageUrl || undefined,
    };

    const res = initialData?.id
      ? await updateOpportunityAction(initialData.id, payload)
      : await createOpportunityAction(payload);

    setIsLoading(false);

    if (res.success) {
      router.push("/admin/opportunities");
      router.refresh();
    } else {
      setErrorMessage(res.message || "Gagal menyimpan peluang.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {errorMessage && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Judul Lomba / Peluang *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          label="Slug Kustom (Opsional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="otomatis-dari-judul"
        />
        <Input
          label="Penyelenggara *"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Kategori *"
          value={category}
          onChange={(e) => setCategory(e.target.value as "LOMBA" | "BEASISWA" | "SEMINAR" | "MAGANG")}
          options={[
            { label: "Lomba / Kompetisi", value: "LOMBA" },
            { label: "Beasiswa", value: "BEASISWA" },
            { label: "Seminar & Workshop", value: "SEMINAR" },
            { label: "Magang / Riset", value: "MAGANG" },
          ]}
        />
        <Input
          type="date"
          label="Batas Pendaftaran (Deadline) *"
          value={deadlineAt}
          onChange={(e) => setDeadlineAt(e.target.value)}
          required
        />
        <Input
          label="Tautan Pendaftaran (URL)"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Deskripsi & Gambaran Acara *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          className="w-full rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Syarat & Ketentuan Partisipasi
        </label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <MediaPicker
        label="Poster / Banner Peluang"
        value={coverImageUrl}
        onChange={setCoverImageUrl}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData?.id ? "Simpan Perubahan" : "Terbitkan Peluang"}
        </Button>
      </div>
    </form>
  );
}
