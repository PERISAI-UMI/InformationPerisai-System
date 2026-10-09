"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { deleteMemberAction } from "../actions";
import { useRouter } from "next/navigation";

export interface MemberTableProps {
  members: Array<{
    id: string;
    name: string;
    nim?: string | null;
    roleOrTitle: string;
    isActive: boolean;
    department?: { name: string } | null;
    period?: { name: string } | null;
  }>;
}

export function MemberTable({ members }: MemberTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const res = await deleteMemberAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal menghapus anggota.");
    }
  };

  if (!members || members.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
        Belum ada anggota pengurus terdaftar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Pengurus</TableHead>
          <TableHead>NIM</TableHead>
          <TableHead>Jabatan</TableHead>
          <TableHead>Departemen</TableHead>
          <TableHead>Periode</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{m.name}</TableCell>
            <TableCell className="font-mono text-xs">{m.nim || "-"}</TableCell>
            <TableCell>{m.roleOrTitle}</TableCell>
            <TableCell>{m.department?.name || "BPH Inti"}</TableCell>
            <TableCell>{m.period?.name || "-"}</TableCell>
            <TableCell>
              {m.isActive ? <Badge variant="success">Aktif</Badge> : <Badge variant="neutral">Nonaktif</Badge>}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Link
                href={`/admin/members/${m.id}`}
                className="text-xs font-semibold text-[#282F44] hover:text-[#E6AF2E] dark:text-[#F5D061] transition-colors"
              >
                Ubah
              </Link>
              <ConfirmDelete
                onConfirm={() => handleDelete(m.id)}
                title="Hapus Pengurus"
                description={`Apakah Anda yakin ingin menghapus "${m.name}"?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
