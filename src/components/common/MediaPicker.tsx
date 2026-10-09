"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function MediaPicker({ value, onChange, label }: MediaPickerProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error("Gagal mengunggah media:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
      <div className="flex gap-2">
        <Input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... atau /uploads/..."
        />
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button type="button" variant="outline" size="md" isLoading={isUploading}>
            Unggah Berkas
          </Button>
        </label>
      </div>
      {value && (
        <div className="mt-1 relative h-28 w-44 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Pratinjau" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
