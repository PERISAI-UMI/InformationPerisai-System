"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { EditLink } from "@/components/common/ActionButtons";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/components/ui/Toast";
import { formatDateIndonesian } from "@/lib/dates";
import { deletePostAction } from "../actions";
import { useRouter } from "next/navigation";

export interface PostTableProps {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    createdAt: Date | string;
    author?: { name: string; email?: string } | null;
  }>;
}

export function PostTable({ posts }: PostTableProps) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge variant="success">Terbit</Badge>;
      case "DRAFT":
        return <Badge variant="warning">Draf</Badge>;
      case "ARCHIVED":
        return <Badge variant="neutral">Arsip</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deletePostAction(id);
      if (res.success) {
        toast.success("Postingan berhasil dihapus dari sistem.");
        router.refresh();
      } else {
        toast.error(res.message || "Gagal menghapus postingan.");
      }
    } catch {
      toast.error("Terjadi galat jaringan saat menghapus postingan.");
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        type="empty"
        title="Belum Ada Postingan Berita"
        description="Belum ada artikel atau rilis berita yang dibuat. Tambahkan postingan pertama untuk dipublikasikan."
        action={{
          label: "Tambah Postingan Baru",
          href: "/admin/posts/new",
        }}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Judul</TableHead>
          <TableHead>Penulis</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Dibuat Pada</TableHead>
          <TableHead className="text-right w-36 whitespace-nowrap">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-bold text-white max-w-xs truncate">
              {post.title}
            </TableCell>
            <TableCell className="text-zinc-300">{post.author?.name || "-"}</TableCell>
            <TableCell>{getStatusBadge(post.status)}</TableCell>
            <TableCell className="text-zinc-400 font-light">{formatDateIndonesian(post.createdAt)}</TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="inline-flex items-center justify-end gap-1.5">
                <EditLink href={`/admin/posts/${post.id}`} />
                <ConfirmDelete
                  onConfirm={() => handleDelete(post.id)}
                  title="Hapus Postingan"
                  description={`Apakah Anda yakin ingin menghapus "${post.title}"?`}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
