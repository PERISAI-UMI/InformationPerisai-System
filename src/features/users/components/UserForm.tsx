"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";
import { createUserAction, updateUserAction } from "../actions";

export interface UserFormProps {
  initialData?: {
    id: string;
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
    isActive: boolean;
  };
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"SUPER_ADMIN" | "ADMIN" | "EDITOR">(
    initialData?.role || "EDITOR"
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      name,
      email,
      password: password || undefined,
      role,
      isActive,
    };

    const res = initialData?.id
      ? await updateUserAction(initialData.id, payload)
      : await createUserAction(payload);

    setIsLoading(false);

    if (res.success) {
      toast.success(initialData?.id ? "Akun pengurus berhasil diperbarui!" : "Akun pengurus baru berhasil ditambahkan!");
      router.push("/admin/users");
      router.refresh();
    } else {
      const msg = res.message || "Gagal menyimpan akun pengguna.";
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
          label="Nama Lengkap *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="email"
          label="Alamat Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          label={initialData?.id ? "Kata Sandi Baru (Kosongkan jika tidak diubah)" : "Kata Sandi *"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!initialData?.id}
          placeholder="••••••••"
        />

        <Select
          label="Tingkat Hak Akses *"
          value={role}
          onChange={(e) => setRole(e.target.value as "SUPER_ADMIN" | "ADMIN" | "EDITOR")}
          options={[
            { label: "Admin Utama (Akses Penuh)", value: "SUPER_ADMIN" },
            { label: "Administrator (Operasional)", value: "ADMIN" },
            { label: "Editor Konten (Penulis Berita)", value: "EDITOR" },
          ]}
        />

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-[#16161a] text-[#FFB22C] accent-[#FFB22C] focus:ring-[#FFB22C]"
          />
          <label htmlFor="isActive" className="text-xs font-semibold text-zinc-300 cursor-pointer">
            Akun Aktif (Dapat Masuk ke Panel)
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData?.id ? "Simpan Perubahan" : "Buat Akun Pengguna"}
        </Button>
      </div>
    </form>
  );
}
