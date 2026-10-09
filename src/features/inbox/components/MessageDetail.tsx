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
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 max-w-3xl space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {message.subject}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
          <span>Dari: <strong className="text-zinc-700 dark:text-zinc-300">{message.name}</strong> ({message.email})</span>
          <span>•</span>
          <span>Diterima: {formatDateIndonesian(message.createdAt)}</span>
        </div>
      </div>

      <div className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
        {message.message}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Link
          href="/admin/inbox"
          className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
        >
          ← Kembali ke Kotak Masuk
        </Link>
        <a
          href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
          className="inline-flex items-center justify-center rounded-lg bg-[#E6AF2E] px-4 py-2 text-xs font-bold text-[#282F44] hover:bg-[#F5D061] transition shadow-xs"
        >
          Balas Lewat Email ✉️
        </a>
      </div>
    </div>
  );
}
