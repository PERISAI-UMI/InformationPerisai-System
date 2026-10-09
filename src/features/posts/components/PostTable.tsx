"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
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
    const res = await deletePostAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal menghapus postingan.");
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
        Belum ada postingan berita. Klik &ldquo;Tambah Postingan Baru&rdquo; untuk memulai.
      </div>
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
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-100 max-w-xs truncate">
              {post.title}
            </TableCell>
            <TableCell>{post.author?.name || "-"}</TableCell>
            <TableCell>{getStatusBadge(post.status)}</TableCell>
            <TableCell>{formatDateIndonesian(post.createdAt)}</TableCell>
            <TableCell className="text-right space-x-2">
              <Link
                href={`/admin/posts/${post.id}`}
                className="text-xs font-semibold text-[#282F44] hover:text-[#E6AF2E] dark:text-[#F5D061] transition-colors"
              >
                Ubah
              </Link>
              <ConfirmDelete
                onConfirm={() => handleDelete(post.id)}
                title="Hapus Postingan"
                description={`Apakah Anda yakin ingin menghapus "${post.title}"?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
