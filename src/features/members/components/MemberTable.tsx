"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { EditLink } from "@/components/common/ActionButtons";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/components/ui/Toast";
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
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function MemberTable({
  members,
  canCreate = true,
  canUpdate = true,
  canDelete = true,
}: MemberTableProps) {
  const router = useRouter();
  const showActionColumn = canUpdate || canDelete;

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteMemberAction(id);
      if (res.success) {
        toast.success("Data anggota pengurus berhasil dihapus.");
        router.refresh();
      } else {
        toast.error(res.message || "Gagal menghapus anggota.");
      }
    } catch {
      toast.error("Terjadi galat jaringan saat menghapus anggota.");
    }
  };

  if (!members || members.length === 0) {
    return (
      <EmptyState
        type="empty"
        title="Belum Ada Anggota Pengurus"
        description="Belum ada data struktur pengurus yang dimasukkan ke dalam basis data organisasi."
        action={
          canCreate
            ? {
                label: "Tambah Pengurus",
                href: "/admin/members/new",
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
          <TableHead>Nama Pengurus</TableHead>
          <TableHead>NIM</TableHead>
          <TableHead>Jabatan</TableHead>
          <TableHead>Departemen</TableHead>
          <TableHead>Periode</TableHead>
          <TableHead>Status</TableHead>
          {showActionColumn && (
            <TableHead className="text-right w-36 whitespace-nowrap">Aksi</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="font-bold text-white min-w-[160px]">{m.name}</TableCell>
            <TableCell className="font-mono text-xs text-zinc-400">{m.nim || "-"}</TableCell>
            <TableCell className="text-zinc-200">{m.roleOrTitle}</TableCell>
            <TableCell className="text-zinc-300">{m.department?.name || "Pengurus Inti"}</TableCell>
            <TableCell className="text-zinc-400 font-light">{m.period?.name || "-"}</TableCell>
            <TableCell>
              {m.isActive ? <Badge variant="success">Aktif</Badge> : <Badge variant="neutral">Nonaktif</Badge>}
            </TableCell>
            {showActionColumn && (
              <TableCell className="text-right whitespace-nowrap">
                <div className="inline-flex items-center justify-end gap-1.5">
                  {canUpdate && <EditLink href={`/admin/members/${m.id}`} />}
                  {canDelete && (
                    <ConfirmDelete
                      onConfirm={() => handleDelete(m.id)}
                      title="Hapus Pengurus"
                      description={`Apakah Anda yakin ingin menghapus "${m.name}"?`}
                    />
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
