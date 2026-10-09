"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = "Tulis konten artikel...",
  error,
}: RichTextEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  const insertTag = (prefix: string, suffix = "") => {
    onChange(`${value}\n${prefix}${suffix}`);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}

      <div className="rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertTag("### Judul Sub-bagian")}
              className="rounded px-2 py-1 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800"
              title="Heading"
            >
              H
            </button>
            <button
              type="button"
              onClick={() => insertTag("**Teks Tebal**")}
              className="rounded px-2 py-1 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertTag("*Teks Miring*")}
              className="rounded px-2 py-1 text-xs italic hover:bg-zinc-200 dark:hover:bg-zinc-800"
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => insertTag("- Poin daftar")}
              className="rounded px-2 py-1 text-xs hover:bg-zinc-200 dark:hover:bg-zinc-800"
              title="Daftar Poin"
            >
              • Daftar
            </button>
            <button
              type="button"
              onClick={() => insertTag("[Teks Tautan](https://example.com)")}
              className="rounded px-2 py-1 text-xs hover:bg-zinc-200 dark:hover:bg-zinc-800"
              title="Sisipkan Tautan"
            >
              🔗 Tautan
            </button>
            <button
              type="button"
              onClick={() => insertTag("<blockquote>Kutipan</blockquote>")}
              className="rounded px-2 py-1 text-xs hover:bg-zinc-200 dark:hover:bg-zinc-800"
              title="Kutipan"
            >
              ” Kutipan
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-zinc-200 pl-2 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition",
                tab === "write"
                  ? "bg-[#E6AF2E] text-[#282F44] font-bold shadow-xs"
                  : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300"
              )}
            >
              Tulis
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition",
                tab === "preview"
                  ? "bg-[#E6AF2E] text-[#282F44] font-bold shadow-xs"
                  : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300"
              )}
            >
              Pratinjau
            </button>
          </div>
        </div>

        {/* Content Area */}
        {tab === "write" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={10}
            className="w-full p-4 font-mono text-sm bg-transparent focus:outline-none dark:text-zinc-100 resize-y"
          />
        ) : (
          <div
            className="prose prose-zinc dark:prose-invert min-h-[240px] p-4 text-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value || "<p class='text-zinc-400'>Belum ada teks pratinjau...</p>" }}
          />
        )}
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
