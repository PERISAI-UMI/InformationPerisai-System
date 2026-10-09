"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/common/MediaPicker";
import { createDepartmentAction, updateDepartmentAction } from "../actions";

export interface DepartmentFormProps {
  initialData?: {
    id: string;
    name: string;
    slug?: string;
    code?: string | null;
    description?: string | null;
    orderIndex?: number;
    logoUrl?: string | null;
  };
}

export function DepartmentForm({ initialData }: DepartmentFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [orderIndex, setOrderIndex] = useState(initialData?.orderIndex ?? 0);
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      name,
      slug: slug || undefined,
      code: code || undefined,
      description: description || undefined,
      orderIndex: Number(orderIndex) || 0,
      logoUrl: logoUrl || undefined,
    };

    const res = initialData?.id
      ? await updateDepartmentAction(initialData.id, payload)
      : await createDepartmentAction(payload);

    setIsLoading(false);

    if (res.success) {
      router.push("/admin/departments");
      router.refresh();
    } else {
      setErrorMessage(res.message || "Gagal menyimpan departemen.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {errorMessage && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nama Departemen *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="contoh: Riset dan Teknologi"
        />
        <Input
          label="Kode Singkatan"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="contoh: RISTEK"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Slug Kustom (Opsional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <Input
          type="number"
          label="Urutan Tampilan (Order Index)"
          value={orderIndex}
          onChange={(e) => setOrderIndex(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Deskripsi Departemen
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Tugas pokok, fungsi, dan fokus bidang departemen..."
        />
      </div>

      <MediaPicker
        label="Logo / Lambang Departemen"
        value={logoUrl}
        onChange={setLogoUrl}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData?.id ? "Simpan Perubahan" : "Tambah Departemen"}
        </Button>
      </div>
    </form>
  );
}
