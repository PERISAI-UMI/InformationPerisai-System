"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { EditLink } from "@/components/common/ActionButtons";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/components/ui/Toast";
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
  canUpdate?: boolean;
}

export function StatisticTable({
  statistics,
  canUpdate = true,
}: StatisticTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteStatisticAction(id);
      if (res.success) {
        toast.success("Indikator statistik berhasil dihapus.");
        router.refresh();
      } else {
        toast.error(res.message || "Gagal menghapus statistik.");
      }
    } catch {
      toast.error("Terjadi galat jaringan saat menghapus statistik.");
    }
  };

  if (!statistics || statistics.length === 0) {
    return (
      <EmptyState
        type="empty"
        title="Belum Ada Indikator Statistik"
        description="Belum ada data capaian atau statistik lembaga yang ditampilkan di beranda publik."
        action={
          canUpdate
            ? {
                label: "Tambah Statistik",
                href: "/admin/statistics/new",
              }
            : undefined
        }
      />
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
          {canUpdate && (
            <TableHead className="text-right w-36 whitespace-nowrap">Aksi</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {statistics.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="w-16 font-mono text-xs text-zinc-400">{s.orderIndex}</TableCell>
            <TableCell className="text-xl">
              {s.icon ? (
                <span>{s.icon}</span>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFB22C]/10 text-[#FFB22C]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              )}
            </TableCell>
            <TableCell className="font-semibold text-white">{s.label}</TableCell>
            <TableCell className="font-mono font-bold text-[#FFB22C]">
              {s.value} {s.suffix || ""}
            </TableCell>
            <TableCell>
              {s.isActive ? <Badge variant="success">Aktif</Badge> : <Badge variant="neutral">Non-aktif</Badge>}
            </TableCell>
            {canUpdate && (
              <TableCell className="text-right whitespace-nowrap">
                <div className="inline-flex items-center justify-end gap-1.5">
                  <EditLink href={`/admin/statistics/${s.id}`} />
                  <ConfirmDelete
                    onConfirm={() => handleDelete(s.id)}
                    title="Hapus Statistik"
                    description={`Apakah Anda yakin ingin menghapus indikator "${s.label}"?`}
                  />
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
