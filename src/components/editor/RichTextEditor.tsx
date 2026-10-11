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
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          {label}
        </label>
      )}

      <div className="rounded-xl border border-white/10 bg-[#202026] overflow-hidden shadow-lg">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#16161a] px-3 py-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertTag("### Judul Sub-bagian")}
              className="rounded px-2.5 py-1 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition"
              title="Heading"
            >
              H
            </button>
            <button
              type="button"
              onClick={() => insertTag("**Teks Tebal**")}
              className="rounded px-2.5 py-1 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertTag("*Teks Miring*")}
              className="rounded px-2.5 py-1 text-xs italic text-zinc-300 hover:text-white hover:bg-white/10 transition"
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => insertTag("- Poin daftar")}
              className="rounded px-2.5 py-1 text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
              title="Daftar Poin"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Daftar</span>
            </button>
            <button
              type="button"
              onClick={() => insertTag("[Teks Tautan](https://example.com)")}
              className="rounded px-2.5 py-1 text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
              title="Sisipkan Tautan"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Tautan</span>
            </button>
            <button
              type="button"
              onClick={() => insertTag("<blockquote>Kutipan</blockquote>")}
              className="rounded px-2.5 py-1 text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
              title="Kutipan"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Kutipan</span>
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition",
                tab === "write"
                  ? "bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-[#16161a] font-bold shadow-xs"
                  : "text-zinc-400 hover:text-white hover:bg-white/10"
              )}
            >
              Tulis
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition",
                tab === "preview"
                  ? "bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-[#16161a] font-bold shadow-xs"
                  : "text-zinc-400 hover:text-white hover:bg-white/10"
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
            className="w-full p-4 font-mono text-sm bg-transparent focus:outline-none text-zinc-100 placeholder-zinc-500 resize-y"
          />
        ) : (
          <div
            className="prose prose-invert min-h-[240px] p-4 text-sm max-w-none text-zinc-200"
            dangerouslySetInnerHTML={{ __html: value || "<p class='text-zinc-500 italic'>Belum ada teks pratinjau...</p>" }}
          />
        )}
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
