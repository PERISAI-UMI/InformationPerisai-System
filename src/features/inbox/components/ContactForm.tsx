"use client";

import React, { useState } from "react";
import { sendContactMessageAction } from "../actions";

import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await sendContactMessageAction({
        name,
        email,
        phone: phone.trim() !== "" ? phone : undefined,
        purpose: "pertanyaan",
        subject,
        message,
      });

      setIsLoading(false);

      if (res.success) {
        const successMsg = res.message || "Pesan Anda berhasil dikirim ke pengurus UKM PERISAI UMI!";
        setStatusMessage({
          type: "success",
          text: successMsg,
        });
        toast.success(successMsg, { title: "Pesan Terkirim!" });
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        const errorMsg = res.message || "Gagal mengirim pesan. Silakan periksa kembali formulir Anda.";
        setStatusMessage({
          type: "error",
          text: errorMsg,
        });
        toast.error(errorMsg);
      }
    } catch {
      setIsLoading(false);
      const networkMsg = "Terjadi kesalahan jaringan saat mengirim pesan.";
      setStatusMessage({
        type: "error",
        text: networkMsg,
      });
      toast.error(networkMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {/* Feedback Alert Status */}
      {statusMessage && (
        <Alert
          variant={statusMessage.type === "success" ? "success" : "error"}
          title={statusMessage.type === "success" ? "Pesan Berhasil Terkirim!" : "Pengiriman Gagal"}
          onClose={() => setStatusMessage(null)}
        >
          {statusMessage.text}
        </Alert>
      )}

      <div className="space-y-4">
        {/* Grid Inputs: Nama & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Nama Lengkap <span className="text-[#FFB22C]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Andi Pratama"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#FFB22C] focus:outline-none focus:ring-1 focus:ring-[#FFB22C] transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Alamat Email <span className="text-[#FFB22C]">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. andi@umi.ac.id"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#FFB22C] focus:outline-none focus:ring-1 focus:ring-[#FFB22C] transition"
              />
            </div>
          </div>
        </div>

        {/* Row: Nomor WhatsApp & Subjek */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Nomor WhatsApp / HP <span className="text-zinc-500 text-[10px] lowercase font-normal">(opsional)</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0812-3456-7890"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#FFB22C] focus:outline-none focus:ring-1 focus:ring-[#FFB22C] transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Subjek / Perihal <span className="text-[#FFB22C]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="e.g. Konsultasi Proposal PKM-RE 2025"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#FFB22C] focus:outline-none focus:ring-1 focus:ring-[#FFB22C] transition"
              />
            </div>
          </div>
        </div>

        {/* Textarea: Pesan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Isi Pesan Lengkap <span className="text-[#FFB22C]">*</span>
            </label>
            <span className="text-[11px] text-zinc-500">Minimal 10 karakter</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            placeholder="Tuliskan rincian pertanyaan, proposal gagasan, atau keperluan Anda kepada pengurus UKM PERISAI UMI..."
            className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder-zinc-500 focus:border-[#FFB22C] focus:outline-none focus:ring-1 focus:ring-[#FFB22C] transition leading-relaxed resize-y"
          />
        </div>
      </div>

      {/* Submit Button & Disclaimer */}
      <div className="pt-2 space-y-3">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-6 py-3.5 text-sm font-extrabold text-[#1b1b1f] shadow-lg shadow-[#FFB22C]/20 hover:brightness-110 hover:shadow-[0_0_25px_rgba(255,178,44,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-[#1b1b1f]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Mengirimkan Pesan...</span>
            </>
          ) : (
            <>
              <span>Kirim Pesan Sekarang</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-zinc-500">
          Informasi Anda dilindungi dan hanya akan digunakan untuk komunikasi resmi pengurus UKM PERISAI UMI.
        </p>
      </div>
    </form>
  );
}
