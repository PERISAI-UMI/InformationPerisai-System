"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/lib/audit";
import { postSchema, type PostInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createPostAction(data: PostInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "create", "posts")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin membuat postingan." };
  }

  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title);

  try {
    const now = Math.floor(Date.now() / 1000);
    const isPub = parsed.data.status.toLowerCase() === "published";
    const post = await prisma.tBerita.create({
      data: {
        judul: parsed.data.title,
        slug,
        konten: parsed.data.content,
        ringkasan: parsed.data.excerpt,
        fotoCover: parsed.data.coverImageUrl,
        status: parsed.data.status.toLowerCase(),
        penulisId: session.user.id,
        diperbaruiOleh: session.user.id,
        tanggalPublish: isPub ? now : null,
        createdAt: now,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_POST",
      resource: "posts",
      resourceId: String(post.idBerita),
      details: { title: post.judul },
    });

    revalidatePath("/kabar");
    revalidatePath("/admin/posts");
    return { success: true, data: { id: String(post.idBerita), ...post } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan postingan: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updatePostAction(id: string, data: PostInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "posts")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin mengubah postingan." };
  }

  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { success: false, message: "ID postingan tidak valid." };

  try {
    const existing = await prisma.tBerita.findUnique({ where: { idBerita: numId } });
    if (!existing) return { success: false, message: "Postingan tidak ditemukan." };

    const now = Math.floor(Date.now() / 1000);
    const slug = parsed.data.slug ? slugify(parsed.data.slug) : existing.slug;
    const isPub = parsed.data.status.toLowerCase() === "published";
    const publishedAt = isPub ? (existing.tanggalPublish ?? now) : null;

    const updated = await prisma.tBerita.update({
      where: { idBerita: numId },
      data: {
        judul: parsed.data.title,
        slug,
        konten: parsed.data.content,
        ringkasan: parsed.data.excerpt,
        fotoCover: parsed.data.coverImageUrl,
        status: parsed.data.status.toLowerCase(),
        tanggalPublish: publishedAt,
        diperbaruiOleh: session.user.id,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_POST",
      resource: "posts",
      resourceId: id,
    });

    revalidatePath("/kabar");
    revalidatePath("/admin/posts");
    return { success: true, data: { id: String(updated.idBerita), ...updated } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui postingan: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deletePostAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "delete", "posts")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin menghapus postingan." };
  }

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { success: false, message: "ID postingan tidak valid." };

  try {
    await prisma.tBerita.delete({ where: { idBerita: numId } });
    await writeAuditLog({
      userId: session.user.id,
      action: "DELETE_POST",
      resource: "posts",
      resourceId: id,
    });

    revalidatePath("/kabar");
    revalidatePath("/admin/posts");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menghapus postingan: " + (err instanceof Error ? err.message : String(err)) };
  }
}
