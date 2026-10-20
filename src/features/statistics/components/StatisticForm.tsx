"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";
import { createStatisticAction, updateStatisticAction } from "../actions";

export interface StatisticFormProps {
  initialData?: {
    id: string;
    label: string;
    value: number;
    suffix?: string | null;
    icon?: string | null;
    orderIndex?: number;
    isActive?: boolean;
  };
}

export function StatisticForm({ initialData }: StatisticFormProps) {
  const router = useRouter();
  const [label, setLabel] = useState(initialData?.label || "");
  const [value, setValue] = useState(initialData?.value ?? 0);
  const [suffix, setSuffix] = useState(initialData?.suffix || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [orderIndex, setOrderIndex] = useState(initialData?.orderIndex ?? 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      label,
      value: Number(value) || 0,
      suffix: suffix || undefined,
      icon: icon || undefined,
      orderIndex: Number(orderIndex) || 0,
      isActive,
    };

    const res = initialData?.id
      ? await updateStatisticAction(initialData.id, payload)
      : await createStatisticAction(payload);

    setIsLoading(false);

    if (res.success) {
      toast.success(initialData?.id ? "Indikator statistik berhasil diperbarui!" : "Indikator statistik baru berhasil ditambahkan!");
      router.push("/admin/statistics");
      router.refresh();
    } else {
      const msg = res.message || "Gagal menyimpan statistik.";
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
          label="Label Indikator *"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          placeholder="contoh: Prestasi Nasional, Judul Riset"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Nilai Angka (Value) *"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            required
          />
          <Input
            label="Akhiran / Satuan (Suffix)"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder="contoh: +, Medali, Tim"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ikon Simbol / Tanda"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="contoh: 🏆 atau 📈"
          />
          <Input
            type="number"
            label="Urutan Tampilan"
            value={orderIndex}
            onChange={(e) => setOrderIndex(Number(e.target.value))}
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
            Tampilkan di Beranda (Aktif)
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData?.id ? "Simpan Perubahan" : "Tambah Statistik"}
        </Button>
      </div>
    </form>
  );
}
