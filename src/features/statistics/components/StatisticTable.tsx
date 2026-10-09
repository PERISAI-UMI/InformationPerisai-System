"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { deleteStatisticAction } from "../actions";
import { useRouter } from "next/navigation";

export interface StatisticTableProps {
  statistics: Array<{
    id: string;
    label: string;
    value: number;
    suffix?: string | null;
    icon?: string | null;
    orderIndex: number;
    isActive: boolean;
  }>;
}

export function StatisticTable({ statistics }: StatisticTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const res = await deleteStatisticAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal menghapus statistik.");
    }
  };

  if (!statistics || statistics.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
        Belum ada indikator statistik terdaftar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Urutan</TableHead>
          <TableHead>Ikon</TableHead>
          <TableHead>Indikator</TableHead>
          <TableHead>Nilai</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {statistics.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="w-16 font-mono text-xs">{s.orderIndex}</TableCell>
            <TableCell className="text-xl">{s.icon || "📊"}</TableCell>
            <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">{s.label}</TableCell>
            <TableCell className="font-mono font-bold text-[#E6AF2E]">
              {s.value} {s.suffix || ""}
            </TableCell>
            <TableCell>
              {s.isActive ? <Badge variant="success">Aktif</Badge> : <Badge variant="neutral">Non-aktif</Badge>}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Link
                href={`/admin/statistics/${s.id}`}
                className="text-xs font-bold text-[#E6AF2E] hover:text-[#b8861b]"
              >
                Ubah
              </Link>
              <ConfirmDelete
                onConfirm={() => handleDelete(s.id)}
                title="Hapus Statistik"
                description={`Apakah Anda yakin ingin menghapus indikator "${s.label}"?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
