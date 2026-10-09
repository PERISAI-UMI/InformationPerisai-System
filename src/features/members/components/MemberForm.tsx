"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/common/MediaPicker";
import { createMemberAction, updateMemberAction } from "../actions";

export interface MemberFormProps {
  periods: Array<{ id: string; name: string }>;
  departments: Array<{ id: string; name: string }>;
  initialData?: {
    id: string;
    name: string;
    nim?: string | null;
    faculty?: string | null;
    major?: string | null;
    periodId: string;
    departmentId?: string | null;
    roleOrTitle: string;
    avatarUrl?: string | null;
    orderIndex?: number;
    isActive?: boolean;
  };
}

export function MemberForm({ periods, departments, initialData }: MemberFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [nim, setNim] = useState(initialData?.nim || "");
  const [faculty, setFaculty] = useState(initialData?.faculty || "");
  const [major, setMajor] = useState(initialData?.major || "");
  const [periodId, setPeriodId] = useState(initialData?.periodId || periods[0]?.id || "");
  const [departmentId, setDepartmentId] = useState(initialData?.departmentId || "");
  const [roleOrTitle, setRoleOrTitle] = useState(initialData?.roleOrTitle || "");
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || "");
  const [orderIndex, setOrderIndex] = useState(initialData?.orderIndex ?? 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      name,
      nim: nim || undefined,
      faculty: faculty || undefined,
      major: major || undefined,
      periodId,
      departmentId: departmentId || undefined,
      roleOrTitle,
      avatarUrl: avatarUrl || undefined,
      orderIndex: Number(orderIndex) || 0,
      isActive,
    };

    const res = initialData?.id
      ? await updateMemberAction(initialData.id, payload)
      : await createMemberAction(payload);

    setIsLoading(false);

    if (res.success) {
      router.push("/admin/members");
      router.refresh();
    } else {
      setErrorMessage(res.message || "Gagal menyimpan pengurus.");
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
          label="Nama Lengkap *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="NIM (Nomor Induk Mahasiswa)"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Fakultas"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          placeholder="contoh: Ilmu Komputer, Kedokteran"
        />
        <Input
          label="Program Studi (Jurusan)"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          placeholder="contoh: Teknik Informatika"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Periode Kepengurusan *"
          value={periodId}
          onChange={(e) => setPeriodId(e.target.value)}
          options={periods.map((p) => ({ label: p.name, value: p.id }))}
        />
        <Select
          label="Departemen (Opsional)"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          options={[
            { label: "-- Tanpa Departemen / BPH Inti --", value: "" },
            ...departments.map((d) => ({ label: d.name, value: d.id })),
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Jabatan / Amanah *"
          value={roleOrTitle}
          onChange={(e) => setRoleOrTitle(e.target.value)}
          required
          placeholder="contoh: Ketua Umum, Koordinator Humas"
        />
        <Input
          type="number"
          label="Urutan Hierarki (Order Index)"
          value={orderIndex}
          onChange={(e) => setOrderIndex(Number(e.target.value))}
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
          Status Pengurus Aktif
        </label>
      </div>

      <MediaPicker
        label="Foto Profil Resmi Pengurus"
        value={avatarUrl}
        onChange={setAvatarUrl}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData?.id ? "Simpan Perubahan" : "Tambah Anggota Pengurus"}
        </Button>
      </div>
    </form>
  );
}
