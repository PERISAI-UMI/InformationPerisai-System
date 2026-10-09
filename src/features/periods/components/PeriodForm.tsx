"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createPeriodAction, updatePeriodAction } from "../actions";

export interface PeriodFormProps {
  initialData?: {
    id: string;
    name: string;
    isActive: boolean;
    startDate: string;
    endDate?: string | null;
    vision?: string | null;
    mission?: string | null;
  };
}

export function PeriodForm({ initialData }: PeriodFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [isActive, setIsActive] = useState(initialData?.isActive || false);
  const [startDate, setStartDate] = useState(
    initialData?.startDate ? initialData.startDate.split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    initialData?.endDate ? initialData.endDate.split("T")[0] : ""
  );
  const [vision, setVision] = useState(initialData?.vision || "");
  const [mission, setMission] = useState(initialData?.mission || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      name,
      isActive,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      vision: vision || undefined,
      mission: mission || undefined,
    };

    const res = initialData?.id
      ? await updatePeriodAction(initialData.id, payload)
      : await createPeriodAction(payload);

    setIsLoading(false);

    if (res.success) {
      router.push("/admin/periods");
      router.refresh();
    } else {
      setErrorMessage(res.message || "Gagal menyimpan periode.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {errorMessage && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMessage}
        </div>
      )}

      <Input
        label="Nama Periode Kepengurusan *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="contoh: Periode 2025/2026"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Tanggal Mulai Periode *"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          type="date"
          label="Tanggal Selesai (Opsional)"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-[#E6AF2E] focus:ring-[#E6AF2E]"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Jadikan Sebagai Periode Aktif Saat Ini (Menonaktifkan periode lainnya)
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Visi Kepengurusan
        </label>
        <textarea
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Misi Kepengurusan
        </label>
        <textarea
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData?.id ? "Simpan Perubahan" : "Tambah Periode"}
        </Button>
      </div>
    </form>
  );
}
