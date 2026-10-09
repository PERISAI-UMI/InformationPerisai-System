"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { formatDateIndonesian } from "@/lib/dates";
import { getOpportunityStatusLabel } from "../status";
import { deleteOpportunityAction } from "../actions";
import { useRouter } from "next/navigation";

export interface OpportunityTableProps {
  opportunities: Array<{
    id: string;
    title: string;
    slug: string;
    organizer: string;
    category: string;
    deadlineAt: Date | string;
  }>;
}

export function OpportunityTable({ opportunities }: OpportunityTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const res = await deleteOpportunityAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal menghapus peluang.");
    }
  };

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
        Belum ada peluang terdaftar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Judul</TableHead>
          <TableHead>Penyelenggara</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Tenggat (Deadline)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {opportunities.map((opp) => {
          const statusInfo = getOpportunityStatusLabel(opp.deadlineAt);

          return (
            <TableRow key={opp.id}>
              <TableCell className="font-medium text-zinc-900 dark:text-zinc-100 max-w-xs truncate">
                {opp.title}
              </TableCell>
              <TableCell>{opp.organizer}</TableCell>
              <TableCell><Badge variant="neutral">{opp.category}</Badge></TableCell>
              <TableCell>{formatDateIndonesian(opp.deadlineAt)}</TableCell>
              <TableCell><Badge variant={statusInfo.variant}>{statusInfo.label}</Badge></TableCell>
              <TableCell className="text-right space-x-2">
                <Link
                  href={`/admin/opportunities/${opp.id}`}
                  className="text-xs font-bold text-[#E6AF2E] hover:text-[#b8861b]"
                >
                  Ubah
                </Link>
                <ConfirmDelete
                  onConfirm={() => handleDelete(opp.id)}
                  title="Hapus Peluang"
                  description={`Apakah Anda yakin ingin menghapus "${opp.title}"?`}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
