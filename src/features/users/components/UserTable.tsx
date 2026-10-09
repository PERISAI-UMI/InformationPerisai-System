"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const res = await toggleUserStatusAction(id, !currentStatus);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal mengubah status akun.");
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
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">{u.name}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>{getRoleBadge(u.role)}</TableCell>
            <TableCell>
              {u.isActive ? (
                <Badge variant="success">Aktif</Badge>
              ) : (
                <Badge variant="danger">Nonaktif</Badge>
              )}
            </TableCell>
            <TableCell className="text-xs text-zinc-500">
              {u._count?.posts ?? 0} artikel / {u._count?.uploadedMedia ?? 0} media
            </TableCell>
            <TableCell className="text-xs">{formatDateIndonesian(u.createdAt)}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                size="sm"
                variant={u.isActive ? "outline" : "primary"}
                onClick={() => handleToggle(u.id, u.isActive)}
              >
                {u.isActive ? "Nonaktifkan" : "Aktifkan"}
              </Button>
              <Link
                href={`/admin/users/${u.id}`}
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
