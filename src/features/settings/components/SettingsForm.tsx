"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateSettingsAction } from "../actions";

export interface SettingsFormProps {
  initialSettings: Array<{
    key: string;
    value: string;
    isPublic: boolean;
    description?: string | null;
  }>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const handleTogglePublic = (key: string, isPublic: boolean) => {
    setSettings((prev) =>
      prev.map((item) => (item.key === key ? { ...item, isPublic } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const res = await updateSettingsAction(settings);
    setIsLoading(false);

    if (res.success) {
      setStatusMessage({ type: "success", text: "Pengaturan sistem berhasil diperbarui!" });
    } else {
      setStatusMessage({ type: "error", text: res.message || "Gagal menyimpan pengaturan." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {statusMessage && (
        <div
          className={`rounded-lg p-4 text-sm ${
            statusMessage.type === "success"
              ? "bg-[#E6AF2E]/15 text-[#282F44] border border-[#E6AF2E]/30 dark:bg-[#E6AF2E]/20 dark:text-[#F5D061]"
              : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="space-y-4">
        {settings.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.key}
                </p>
                {item.description && (
                  <p className="text-xs text-zinc-500">{item.description}</p>
                )}
              </div>
              <label className="flex items-center gap-1.5 text-xs text-zinc-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.isPublic}
                  onChange={(e) => handleTogglePublic(item.key, e.target.checked)}
                  className="rounded border-zinc-300 text-[#E6AF2E] focus:ring-[#E6AF2E]"
                />
                Publik
              </label>
            </div>
            <Input
              value={item.value}
              onChange={(e) => handleChange(item.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Simpan Semua Pengaturan
        </Button>
      </div>
    </form>
  );
}
