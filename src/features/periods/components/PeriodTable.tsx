"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateIndonesian } from "@/lib/dates";
import { setActivePeriodAction } from "../actions";
import { useRouter } from "next/navigation";

export interface PeriodTableProps {
  periods: Array<{
    id: string;
    name: string;
    isActive: boolean;
    startDate: Date | string;
    endDate?: Date | string | null;
    _count?: {
      members?: number;
      workPrograms?: number;
    };
  }>;
}

export function PeriodTable({ periods }: PeriodTableProps) {
  const router = useRouter();

  const handleSetActive = async (id: string) => {
    const res = await setActivePeriodAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal mengaktifkan periode.");
    }
  };

  if (!periods || periods.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
        Belum ada periode kepengurusan terdaftar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Periode</TableHead>
          <TableHead>Mulai</TableHead>
          <TableHead>Selesai</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pengurus / Proker</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {periods.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">{p.name}</TableCell>
            <TableCell>{formatDateIndonesian(p.startDate)}</TableCell>
            <TableCell>{p.endDate ? formatDateIndonesian(p.endDate) : "Sekarang"}</TableCell>
            <TableCell>
              {p.isActive ? (
                <Badge variant="success">Periode Aktif</Badge>
              ) : (
                <Badge variant="neutral">Demisioner</Badge>
              )}
            </TableCell>
            <TableCell>
              {p._count?.members ?? 0} orang / {p._count?.workPrograms ?? 0} proker
            </TableCell>
            <TableCell className="text-right space-x-2">
              {!p.isActive && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSetActive(p.id)}
                >
                  Jadikan Aktif
                </Button>
              )}
              <Link
                href={`/admin/periods/${p.id}`}
                className="text-xs font-bold text-[#E6AF2E] hover:text-[#b8861b]"
              >
                Ubah
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
