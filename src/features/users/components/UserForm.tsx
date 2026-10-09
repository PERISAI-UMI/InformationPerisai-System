"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
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
      router.push("/admin/users");
      router.refresh();
    } else {
      setErrorMessage(res.message || "Gagal menyimpan akun pengguna.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {errorMessage && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMessage}
        </div>
      )}

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

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-[#E6AF2E] focus:ring-[#E6AF2E]"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Akun Aktif (Dapat Masuk ke Panel)
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
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
