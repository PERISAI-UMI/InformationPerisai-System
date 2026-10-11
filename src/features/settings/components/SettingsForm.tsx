"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";
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
      const msg = "Pengaturan sistem berhasil diperbarui!";
      setStatusMessage({ type: "success", text: msg });
      toast.success(msg);
    } else {
      const msg = res.message || "Gagal menyimpan pengaturan.";
      setStatusMessage({ type: "error", text: msg });
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {statusMessage && (
        <Alert
          variant={statusMessage.type === "success" ? "success" : "error"}
          title={statusMessage.type === "success" ? "Pembaruan Berhasil" : "Gagal Memperbarui"}
          onClose={() => setStatusMessage(null)}
        >
          {statusMessage.text}
        </Alert>
      )}

      <div className="space-y-4">
        {settings.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl border border-white/10 bg-[#202026] p-5 space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs font-bold text-white tracking-wide">
                  {item.key}
                </p>
                {item.description && (
                  <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
                )}
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={item.isPublic}
                  onChange={(e) => handleTogglePublic(item.key, e.target.checked)}
                  className="rounded border-white/20 bg-[#16161a] text-[#FFB22C] accent-[#FFB22C] focus:ring-[#FFB22C] h-4 w-4"
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

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Simpan Semua Pengaturan
        </Button>
      </div>
    </form>
  );
}
