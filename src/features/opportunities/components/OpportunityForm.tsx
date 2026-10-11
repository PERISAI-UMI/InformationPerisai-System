"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/common/MediaPicker";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";
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
      toast.success(initialData?.id ? "Peluang / kompetisi berhasil diperbarui!" : "Peluang baru berhasil ditambahkan!");
      router.push("/admin/opportunities");
      router.refresh();
    } else {
      const msg = res.message || "Gagal menyimpan peluang.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {errorMessage && (
        <div className="animate-shake">
          <Alert variant="error" title="Gagal Menyimpan" onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#202026] p-6 shadow-lg space-y-5">
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

        <Textarea
          label="Deskripsi & Gambaran Acara *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />

        <Textarea
          label="Syarat & Ketentuan Partisipasi"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={3}
        />

        <MediaPicker
          label="Poster / Banner Peluang"
          value={coverImageUrl}
          onChange={setCoverImageUrl}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
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
