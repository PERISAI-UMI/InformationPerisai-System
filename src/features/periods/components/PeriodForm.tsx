"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";
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
      toast.success(initialData?.id ? "Periode berhasil diperbarui!" : "Periode baru berhasil dibuat!");
      router.push("/admin/periods");
      router.refresh();
    } else {
      const msg = res.message || "Gagal menyimpan periode.";
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

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-[#16161a] text-[#FFB22C] accent-[#FFB22C] focus:ring-[#FFB22C]"
          />
          <label htmlFor="isActive" className="text-xs font-semibold text-zinc-300 cursor-pointer">
            Jadikan Sebagai Periode Aktif Saat Ini (Menonaktifkan periode lainnya)
          </label>
        </div>

        <Textarea
          label="Visi Kepengurusan"
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          rows={3}
          placeholder="Visi utama kepengurusan periode ini..."
        />

        <Textarea
          label="Misi Kepengurusan"
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          rows={3}
          placeholder="Misi-misi strategis kepengurusan periode ini..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
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
