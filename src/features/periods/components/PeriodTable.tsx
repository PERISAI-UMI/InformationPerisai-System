"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/components/ui/Toast";
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

  const handleSetActive = async (id: string, periodName: string) => {
    try {
      const res = await setActivePeriodAction(id);
      if (res.success) {
        toast.success(`Periode "${periodName}" sekarang aktif sebagai kepengurusan berjalan.`);
        router.refresh();
      } else {
        toast.error(res.message || "Gagal mengaktifkan periode.");
      }
    } catch {
      toast.error("Terjadi galat jaringan saat mengaktifkan periode.");
    }
  };

  if (!periods || periods.length === 0) {
    return (
      <EmptyState
        type="empty"
        title="Belum Ada Periode Kepengurusan"
        description="Belum ada periode kepengurusan yang ditambahkan ke sistem UKM PERISAI UMI."
        action={{
          label: "Tambah Periode Baru",
          href: "/admin/periods/new",
        }}
      />
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
            <TableCell className="font-bold text-white">{p.name}</TableCell>
            <TableCell className="text-zinc-400 font-light">{formatDateIndonesian(p.startDate)}</TableCell>
            <TableCell className="text-zinc-400 font-light">{p.endDate ? formatDateIndonesian(p.endDate) : "Sekarang"}</TableCell>
            <TableCell>
              {p.isActive ? (
                <Badge variant="success">Periode Aktif</Badge>
              ) : (
                <Badge variant="neutral">Demisioner</Badge>
              )}
            </TableCell>
            <TableCell className="text-zinc-300">
              {p._count?.members ?? 0} orang / {p._count?.workPrograms ?? 0} proker
            </TableCell>
            <TableCell className="text-right space-x-3">
              {!p.isActive && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSetActive(p.id, p.name)}
                >
                  Jadikan Aktif
                </Button>
              )}
              <Link
                href={`/admin/periods/${p.id}`}
                className="text-xs font-bold text-[#FFB22C] hover:text-[#FFC85A] transition-colors"
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
