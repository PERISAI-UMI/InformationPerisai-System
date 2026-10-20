"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/components/ui/Toast";
import { formatDateIndonesian } from "@/lib/dates";
import { deleteMessageAction, markAsReadAction } from "../actions";
import { useRouter } from "next/navigation";

export interface InboxTableProps {
  messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    isRead: boolean;
    createdAt: Date | string;
  }>;
  canMarkRead?: boolean;
  canDelete?: boolean;
}

export function InboxTable({
  messages,
  canMarkRead = true,
  canDelete = true,
}: InboxTableProps) {
  const router = useRouter();

  const handleMarkRead = async (id: string) => {
    try {
      await markAsReadAction(id);
      toast.info("Pesan ditandai telah dibaca.");
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui status pesan.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteMessageAction(id);
      if (res.success) {
        toast.success("Pesan masuk berhasil dihapus.");
        router.refresh();
      } else {
        toast.error(res.message || "Gagal menghapus pesan.");
      }
    } catch {
      toast.error("Terjadi galat jaringan saat menghapus pesan.");
    }
  };

  if (!messages || messages.length === 0) {
    return (
      <EmptyState
        type="empty"
        title="Kotak Masuk Kosong"
        description="Belum ada pesan, pertanyaan, atau konsultasi baru yang dikirim melalui formulir kontak publik."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pengirim</TableHead>
          <TableHead>Subjek</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right w-48 whitespace-nowrap">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((msg) => (
          <TableRow key={msg.id} className={!msg.isRead ? "bg-[#FFB22C]/[0.04]" : ""}>
            <TableCell>
              <div>
                <p className="font-semibold text-white">{msg.name}</p>
                <p className="text-xs text-zinc-400 font-normal">{msg.email}</p>
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate text-zinc-200">
              <Link href={`/admin/inbox/${msg.id}`} className="hover:text-[#FFB22C] transition-colors">
                {msg.subject}
              </Link>
            </TableCell>
            <TableCell className="font-normal text-xs text-zinc-400">{formatDateIndonesian(msg.createdAt)}</TableCell>
            <TableCell>
              {msg.isRead ? (
                <Badge variant="neutral">Dibaca</Badge>
              ) : (
                <Badge variant="primary">Baru</Badge>
              )}
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="inline-flex items-center justify-end gap-1.5">
                <Link
                  href={`/admin/inbox/${msg.id}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#FFB22C] bg-[#FFB22C]/10 border border-[#FFB22C]/25 hover:bg-[#FFB22C]/20 hover:border-[#FFB22C]/40 transition-all shadow-sm shrink-0"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Buka</span>
                </Link>
                {canMarkRead && !msg.isRead && (
                  <button
                    onClick={() => handleMarkRead(msg.id)}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-pointer shrink-0"
                  >
                    Tandai Dibaca
                  </button>
                )}
                {canDelete && (
                  <ConfirmDelete
                    onConfirm={() => handleDelete(msg.id)}
                    title="Hapus Pesan"
                    description={`Apakah Anda yakin ingin menghapus pesan "${msg.subject}"?`}
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
