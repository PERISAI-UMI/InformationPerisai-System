"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
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
    const res = await deleteDepartmentAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal menghapus departemen.");
    }
  };

  if (!departments || departments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
        Belum ada departemen terdaftar.
      </div>
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
            <TableCell className="w-16 font-mono text-xs">{dept.orderIndex}</TableCell>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{dept.name}</TableCell>
            <TableCell>{dept.code || "-"}</TableCell>
            <TableCell>{dept._count?.members ?? 0} orang</TableCell>
            <TableCell>{dept._count?.workPrograms ?? 0} program</TableCell>
            <TableCell className="text-right space-x-2">
              <Link
                href={`/admin/departments/${dept.id}`}
                className="text-xs font-semibold text-[#282F44] hover:text-[#E6AF2E] dark:text-[#F5D061] transition-colors"
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
