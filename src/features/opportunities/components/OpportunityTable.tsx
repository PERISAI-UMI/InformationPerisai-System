"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { EditLink } from "@/components/common/ActionButtons";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/components/ui/Toast";
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
    try {
      const res = await deleteOpportunityAction(id);
      if (res.success) {
        toast.success("Peluang / kompetisi berhasil dihapus.");
        router.refresh();
      } else {
        toast.error(res.message || "Gagal menghapus peluang.");
      }
    } catch {
      toast.error("Terjadi galat jaringan saat menghapus peluang.");
    }
  };

  if (!opportunities || opportunities.length === 0) {
    return (
      <EmptyState
        type="empty"
        title="Belum Ada Peluang & Lomba"
        description="Belum ada informasi lomba ilmiah, hibah riset, atau beasiswa yang terdaftar."
        action={{
          label: "Tambah Peluang Baru",
          href: "/admin/opportunities/new",
        }}
      />
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
          <TableHead className="text-right w-36 whitespace-nowrap">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {opportunities.map((opp) => {
          const statusInfo = getOpportunityStatusLabel(opp.deadlineAt);

          return (
            <TableRow key={opp.id}>
              <TableCell className="font-bold text-white max-w-xs truncate">
                {opp.title}
              </TableCell>
              <TableCell className="text-zinc-300">{opp.organizer}</TableCell>
              <TableCell><Badge variant="neutral">{opp.category}</Badge></TableCell>
              <TableCell className="text-zinc-400 font-light">{formatDateIndonesian(opp.deadlineAt)}</TableCell>
              <TableCell><Badge variant={statusInfo.variant}>{statusInfo.label}</Badge></TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <div className="inline-flex items-center justify-end gap-1.5">
                  <EditLink href={`/admin/opportunities/${opp.id}`} />
                  <ConfirmDelete
                    onConfirm={() => handleDelete(opp.id)}
                    title="Hapus Peluang"
                    description={`Apakah Anda yakin ingin menghapus "${opp.title}"?`}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
