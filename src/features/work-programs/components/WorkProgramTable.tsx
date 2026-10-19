"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { EditLink } from "@/components/common/ActionButtons";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/components/ui/Toast";
import { deleteWorkProgramAction } from "../actions";
import { useRouter } from "next/navigation";

export interface WorkProgramTableProps {
  programs: Array<{
    id: string;
    name: string;
    slug: string;
    status: string;
    department?: { name: string } | null;
    period?: { name: string } | null;
  }>;
}

export function WorkProgramTable({ programs }: WorkProgramTableProps) {
  const router = useRouter();

  const getBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="success">Selesai</Badge>;
      case "ONGOING":
        return <Badge variant="primary">Berjalan</Badge>;
      case "PLANNED":
        return <Badge variant="warning">Rencana</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteWorkProgramAction(id);
      if (res.success) {
        toast.success("Program kerja berhasil dihapus.");
        router.refresh();
      } else {
        toast.error(res.message || "Gagal menghapus program kerja.");
      }
    } catch {
      toast.error("Terjadi galat jaringan saat menghapus program kerja.");
    }
  };

  if (!programs || programs.length === 0) {
    return (
      <EmptyState
        type="empty"
        title="Belum Ada Program Kerja"
        description="Belum ada program kerja terdaftar untuk periode ini. Silakan tambahkan program kerja baru."
        action={{
          label: "Tambah Program Kerja",
          href: "/admin/work-programs/new",
        }}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Program</TableHead>
          <TableHead>Departemen</TableHead>
          <TableHead>Periode</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right w-36 whitespace-nowrap">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programs.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-bold text-white">{p.name}</TableCell>
            <TableCell className="text-zinc-300">{p.department?.name || "-"}</TableCell>
            <TableCell className="text-zinc-400 font-light">{p.period?.name || "-"}</TableCell>
            <TableCell>{getBadge(p.status)}</TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="inline-flex items-center justify-end gap-1.5">
                <EditLink href={`/admin/work-programs/${p.id}`} />
                <ConfirmDelete
                  onConfirm={() => handleDelete(p.id)}
                  title="Hapus Program Kerja"
                  description={`Apakah Anda yakin ingin menghapus "${p.name}"?`}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
