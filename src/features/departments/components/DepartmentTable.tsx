"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/components/ui/Toast";
import { deleteDepartmentAction } from "../actions";
import { useRouter } from "next/navigation";

export interface DepartmentTableProps {
  departments: Array<{
    id: string;
    name: string;
    slug: string;
    code?: string | null;
    orderIndex: number;
    _count?: {
      members?: number;
      workPrograms?: number;
    };
  }>;
}

export function DepartmentTable({ departments }: DepartmentTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteDepartmentAction(id);
      if (res.success) {
        toast.success("Departemen berhasil dihapus.");
        router.refresh();
      } else {
        toast.error(res.message || "Gagal menghapus departemen.");
      }
    } catch {
      toast.error("Terjadi galat jaringan saat menghapus departemen.");
    }
  };

  if (!departments || departments.length === 0) {
    return (
      <EmptyState
        type="empty"
        title="Belum Ada Departemen"
        description="Belum ada divisi atau departemen bidang riset yang ditambahkan ke sistem."
        action={{
          label: "Tambah Departemen Baru",
          href: "/admin/departments/new",
        }}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Urutan</TableHead>
          <TableHead>Nama Departemen</TableHead>
          <TableHead>Kode</TableHead>
          <TableHead>Jumlah Pengurus</TableHead>
          <TableHead>Jumlah Proker</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((dept) => (
          <TableRow key={dept.id}>
            <TableCell className="w-16 font-mono text-xs text-zinc-400">{dept.orderIndex}</TableCell>
            <TableCell className="font-bold text-white">{dept.name}</TableCell>
            <TableCell className="text-zinc-300 font-mono text-xs">{dept.code || "-"}</TableCell>
            <TableCell className="text-zinc-300">{dept._count?.members ?? 0} orang</TableCell>
            <TableCell className="text-zinc-300">{dept._count?.workPrograms ?? 0} program</TableCell>
            <TableCell className="text-right space-x-3">
              <Link
                href={`/admin/departments/${dept.id}`}
                className="text-xs font-bold text-[#FFB22C] hover:text-[#FFC85A] transition-colors"
              >
                Ubah
              </Link>
              <ConfirmDelete
                onConfirm={() => handleDelete(dept.id)}
                title="Hapus Departemen"
                description={`Apakah Anda yakin ingin menghapus departemen "${dept.name}"?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
