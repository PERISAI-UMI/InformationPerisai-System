import Link from "next/link";
import { formatDateIndonesian } from "@/lib/dates";

export interface MessageDetailProps {
  message: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Date | string;
    isRead: boolean;
  };
}

export function MessageDetail({ message }: MessageDetailProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#202026] p-6 sm:p-8 w-full max-w-4xl mx-auto space-y-6 shadow-xl">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white">
          {message.subject}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
          <span>Dari: <strong className="text-white font-semibold">{message.name}</strong> ({message.email})</span>
          <span>•</span>
          <span>Diterima: {formatDateIndonesian(message.createdAt)}</span>
        </div>
      </div>

      <div className="whitespace-pre-wrap text-sm text-zinc-200 leading-relaxed font-sans bg-[#16161a] p-5 rounded-xl border border-white/10">
        {message.message}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Link
          href="/admin/inbox"
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          ← Kembali ke Kotak Masuk
        </Link>
        <a
          href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB22C] to-[#FFA000] px-4 py-2 text-xs font-bold text-[#16161a] hover:from-[#FFA000] hover:to-[#FF8F00] transition shadow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Balas Lewat Email</span>
        </a>
      </div>
    </div>
  );
}
