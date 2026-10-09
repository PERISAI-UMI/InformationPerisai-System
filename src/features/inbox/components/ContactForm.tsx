"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { sendContactMessageAction } from "../actions";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const res = await sendContactMessageAction({
      name,
      email,
      subject,
      message,
    });

    setIsLoading(false);

    if (res.success) {
      setStatusMessage({ type: "success", text: res.message || "Pesan Anda berhasil dikirim!" });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      setStatusMessage({ type: "error", text: res.message || "Gagal mengirim pesan." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {statusMessage && (
        <div
          className={`rounded-lg p-4 text-sm ${
            statusMessage.type === "success"
              ? "bg-[#E6AF2E]/15 text-[#282F44] border border-[#E6AF2E]/30 font-medium dark:bg-[#E6AF2E]/20 dark:text-[#F5D061]"
              : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nama Lengkap *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Nama Anda"
        />
        <Input
          type="email"
          label="Alamat Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email@example.com"
        />
      </div>

      <Input
        label="Subjek / Hal *"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
        placeholder="misal: Kerjasama Riset, Pertanyaan Pendaftaran"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Isi Pesan *
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          className="w-full rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Tuliskan pesan atau pertanyaan Anda kepada pengurus UKM PERISAI UMI..."
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
        Kirim Pesan Sekarang
      </Button>
    </form>
  );
}
