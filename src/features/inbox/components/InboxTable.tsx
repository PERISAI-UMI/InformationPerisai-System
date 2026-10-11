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
}

export function InboxTable({ messages }: InboxTableProps) {
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
          <TableHead className="text-right">Aksi</TableHead>
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
            <TableCell className="text-right space-x-2">
              <Link
                href={`/admin/inbox/${msg.id}`}
                className="text-xs font-semibold text-[#FFB22C] hover:text-[#FFA000] transition-colors"
              >
                Buka
              </Link>
              {!msg.isRead && (
                <button
                  onClick={() => handleMarkRead(msg.id)}
                  className="text-xs text-zinc-400 hover:text-white cursor-pointer transition-colors"
                >
                  Tandai Dibaca
                </button>
              )}
              <ConfirmDelete
                onConfirm={() => handleDelete(msg.id)}
                title="Hapus Pesan"
                description={`Apakah Anda yakin ingin menghapus pesan "${msg.subject}"?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
