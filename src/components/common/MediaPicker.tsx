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
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 min-w-0">
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau /uploads/..."
            className="w-full"
          />
        </div>
        <label className="shrink-0 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            size="md"
            isLoading={isUploading}
            className="h-[42px] px-4 whitespace-nowrap gap-1.5 text-xs font-bold border-white/15 bg-white/5 hover:border-[#FFB22C] hover:text-[#FFB22C] hover:bg-[#FFB22C]/10 transition-all shadow-sm shrink-0"
          >
            {!isUploading && (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            )}
            <span>{isUploading ? "Mengunggah..." : "Unggah"}</span>
          </Button>
        </label>
      </div>

      {value && (
        <div className="mt-2 flex items-center gap-3 p-2.5 rounded-xl border border-white/10 bg-[#16161a] max-w-md">
          <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-white/10 bg-black/40 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Pratinjau" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate" title={value}>
              {value.split("/").pop() || value}
            </p>
            <p className="text-[10px] font-mono text-zinc-500 truncate" title={value}>
              {value}
            </p>
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1 text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Hapus Lampiran</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
