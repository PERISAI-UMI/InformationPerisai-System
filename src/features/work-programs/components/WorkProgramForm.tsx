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
import { createWorkProgramAction, updateWorkProgramAction } from "../actions";

export interface WorkProgramFormProps {
  departments: Array<{ id: string; name: string }>;
  periods: Array<{ id: string; name: string }>;
  initialData?: {
    id: string;
    name: string;
    slug?: string;
    departmentId: string;
    periodId: string;
    description: string;
    objectives?: string | null;
    targetDate?: string | null;
    status: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
    coverImageUrl?: string | null;
  };
}

export function WorkProgramForm({ departments, periods, initialData }: WorkProgramFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [departmentId, setDepartmentId] = useState(initialData?.departmentId || departments[0]?.id || "");
  const [periodId, setPeriodId] = useState(initialData?.periodId || periods[0]?.id || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [objectives, setObjectives] = useState(initialData?.objectives || "");
  const [targetDate, setTargetDate] = useState(initialData?.targetDate || "");
  const [status, setStatus] = useState<"PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED">(
    initialData?.status || "PLANNED"
  );
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      name,
      slug: slug || undefined,
      departmentId,
      periodId,
      description,
      objectives: objectives || undefined,
      targetDate: targetDate || undefined,
      status,
      coverImageUrl: coverImageUrl || undefined,
    };

    const res = initialData?.id
      ? await updateWorkProgramAction(initialData.id, payload)
      : await createWorkProgramAction(payload);

    setIsLoading(false);

    if (res.success) {
      toast.success(initialData?.id ? "Program kerja berhasil diperbarui!" : "Program kerja baru berhasil dibuat!");
      router.push("/admin/work-programs");
      router.refresh();
    } else {
      const msg = res.message || "Gagal menyimpan program kerja.";
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

      <div className="rounded-2xl border border-white/10 bg-[#202026] p-6 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nama Program Kerja *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Slug Kustom (Opsional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Departemen Pelaksana *"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            options={departments.map((d) => ({ label: d.name, value: d.id }))}
          />
          <Select
            label="Periode Kepengurusan *"
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
            options={periods.map((p) => ({ label: p.name, value: p.id }))}
          />
          <Select
            label="Status Pelaksanaan *"
            value={status}
            onChange={(e) => setStatus(e.target.value as "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED")}
            options={[
              { label: "Direncanakan (Planned)", value: "PLANNED" },
              { label: "Sedang Berjalan (Ongoing)", value: "ONGOING" },
              { label: "Selesai (Completed)", value: "COMPLETED" },
              { label: "Dibatalkan (Cancelled)", value: "CANCELLED" },
            ]}
          />
          <Input
            label="Target Pelaksanaan"
            placeholder="Contoh: November 2026"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <Textarea
          label="Deskripsi Program Kerja *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />

        <Textarea
          label="Tujuan & Indikator Keberhasilan (Objectives)"
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          rows={3}
        />

        <MediaPicker
          label="Foto / Banner Dokumentasi Proker"
          value={coverImageUrl}
          onChange={setCoverImageUrl}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData?.id ? "Simpan Perubahan" : "Tambah Program Kerja"}
        </Button>
      </div>
    </form>
  );
}
