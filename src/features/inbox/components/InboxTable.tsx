"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
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
    await markAsReadAction(id);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    const res = await deleteMessageAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal menghapus pesan.");
    }
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
        Kotak masuk kosong. Belum ada pesan dari pengunjung.
      </div>
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
          <TableRow key={msg.id} className={!msg.isRead ? "font-semibold bg-[#E6AF2E]/10" : ""}>
            <TableCell>
              <div>
                <p className="text-zinc-900 dark:text-zinc-100">{msg.name}</p>
                <p className="text-xs text-zinc-500 font-normal">{msg.email}</p>
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate text-zinc-800 dark:text-zinc-200">
              <Link href={`/admin/inbox/${msg.id}`} className="hover:underline">
                {msg.subject}
              </Link>
            </TableCell>
            <TableCell className="font-normal text-xs">{formatDateIndonesian(msg.createdAt)}</TableCell>
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
                className="text-xs font-semibold text-[#282F44] hover:text-[#E6AF2E] dark:text-[#F5D061] transition-colors"
              >
                Buka
              </Link>
              {!msg.isRead && (
                <button
                  onClick={() => handleMarkRead(msg.id)}
                  className="text-xs text-zinc-500 hover:text-zinc-800 cursor-pointer"
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
