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
    const post = await prisma.post.create({
      data: {
        title: parsed.data.title,
        slug,
        content: parsed.data.content,
        excerpt: parsed.data.excerpt,
        coverMediaId: parsed.data.coverImageUrl,
        status: parsed.data.status.toLowerCase(),
        createdBy: session.user.id,
        updatedBy: session.user.id,
        publishedAt: isPub ? now : null,
        createdAt: now,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_POST",
      resource: "posts",
      resourceId: post.id,
      details: { title: post.title },
    });

    revalidatePath("/kabar");
    revalidatePath("/admin/posts");
    return { success: true, data: post };
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

  try {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Postingan tidak ditemukan." };

    const now = Math.floor(Date.now() / 1000);
    const slug = parsed.data.slug ? slugify(parsed.data.slug) : existing.slug;
    const isPub = parsed.data.status.toLowerCase() === "published";
    const publishedAt = isPub ? (existing.publishedAt ?? now) : null;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug,
        content: parsed.data.content,
        excerpt: parsed.data.excerpt,
        coverMediaId: parsed.data.coverImageUrl,
        status: parsed.data.status.toLowerCase(),
        publishedAt,
        updatedBy: session.user.id,
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
    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui postingan: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deletePostAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "delete", "posts")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin menghapus postingan." };
  }

  try {
    await prisma.post.delete({ where: { id } });
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
