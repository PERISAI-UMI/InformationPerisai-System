"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
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
    const res = await deleteWorkProgramAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal menghapus program kerja.");
    }
  };

  if (!programs || programs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
        Belum ada program kerja terdaftar.
      </div>
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
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programs.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{p.name}</TableCell>
            <TableCell>{p.department?.name || "-"}</TableCell>
            <TableCell>{p.period?.name || "-"}</TableCell>
            <TableCell>{getBadge(p.status)}</TableCell>
            <TableCell className="text-right space-x-2">
              <Link
                href={`/admin/work-programs/${p.id}`}
                className="text-xs font-bold text-[#E6AF2E] hover:text-[#b8861b]"
              >
                Ubah
              </Link>
              <ConfirmDelete
                onConfirm={() => handleDelete(p.id)}
                title="Hapus Program Kerja"
                description={`Apakah Anda yakin ingin menghapus "${p.name}"?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
