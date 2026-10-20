"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EditLink } from "@/components/common/ActionButtons";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/components/ui/Toast";
import { formatDateIndonesian } from "@/lib/dates";
import { toggleUserStatusAction } from "../actions";
import { useRouter } from "next/navigation";

export interface UserTableProps {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date | string;
    _count?: {
      posts?: number;
      uploadedMedia?: number;
    };
  }>;
  canCreate?: boolean;
  canUpdate?: boolean;
}

export function UserTable({
  users,
  canCreate = true,
  canUpdate = true,
}: UserTableProps) {
  const router = useRouter();

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await toggleUserStatusAction(id, !currentStatus);
      if (res.success) {
        toast.success(
          !currentStatus
            ? "Akun pengurus berhasil diaktifkan kembali."
            : "Akun pengurus berhasil dinonaktifkan."
        );
        router.refresh();
      } else {
        toast.error(res.message || "Gagal mengubah status akun.");
      }
    } catch {
      toast.error("Terjadi galat jaringan saat mengubah status akun.");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Badge variant="primary">Admin Utama</Badge>;
      case "ADMIN":
        return <Badge variant="info">Administrator</Badge>;
      case "EDITOR":
        return <Badge variant="neutral">Editor Konten</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  if (!users || users.length === 0) {
    return (
      <EmptyState
        type="empty"
        title="Belum Ada Pengguna Terdaftar"
        description="Belum ada akun pengurus atau administrator yang terdaftar di dalam sistem."
        action={
          canCreate
            ? {
                label: "Tambah Akun Pengurus",
                href: "/admin/users/new",
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
          <TableHead>Nama Pengguna</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Peran</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Kontribusi</TableHead>
          <TableHead>Bergabung</TableHead>
          {canUpdate && (
            <TableHead className="text-right w-44 whitespace-nowrap">Aksi</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell className="font-semibold text-white">{u.name}</TableCell>
            <TableCell className="text-zinc-300">{u.email}</TableCell>
            <TableCell>{getRoleBadge(u.role)}</TableCell>
            <TableCell>
              {u.isActive ? (
                <Badge variant="success">Aktif</Badge>
              ) : (
                <Badge variant="danger">Nonaktif</Badge>
              )}
            </TableCell>
            <TableCell className="text-xs text-zinc-400">
              {u._count?.posts ?? 0} artikel / {u._count?.uploadedMedia ?? 0} media
            </TableCell>
            <TableCell className="text-xs text-zinc-400">{formatDateIndonesian(u.createdAt)}</TableCell>
            {canUpdate && (
              <TableCell className="text-right whitespace-nowrap">
                <div className="inline-flex items-center justify-end gap-1.5">
                  <Button
                    size="sm"
                    variant={u.isActive ? "outline" : "primary"}
                    className="px-2.5 py-1.5 text-xs rounded-lg"
                    onClick={() => handleToggle(u.id, u.isActive)}
                  >
                    {u.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                  <EditLink href={`/admin/users/${u.id}`} />
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
