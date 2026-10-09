"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/lib/audit";
import { workProgramSchema, type WorkProgramInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createWorkProgramAction(data: WorkProgramInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "create", "work_programs")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin mengelola program kerja." };
  }

  const parsed = workProgramSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  try {
    const now = Math.floor(Date.now() / 1000);
    const proker = await prisma.workProgram.create({
      data: {
        title: parsed.data.name,
        slug,
        departmentId: parsed.data.departmentId,
        summary: parsed.data.objectives || null,
        content: parsed.data.description,
        coverMediaId: parsed.data.coverImageUrl,
        status: "published",
        publishedAt: now,
        createdBy: session.user.id,
        updatedBy: session.user.id,
        createdAt: now,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_WORK_PROGRAM",
      resource: "work_programs",
      resourceId: proker.id,
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/work-programs");
    return { success: true, data: proker };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan program kerja: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updateWorkProgramAction(id: string, data: WorkProgramInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "work_programs")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = workProgramSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const updated = await prisma.workProgram.update({
      where: { id },
      data: {
        title: parsed.data.name,
        departmentId: parsed.data.departmentId,
        summary: parsed.data.objectives || null,
        content: parsed.data.description,
        coverMediaId: parsed.data.coverImageUrl,
        updatedBy: session.user.id,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_WORK_PROGRAM",
      resource: "work_programs",
      resourceId: id,
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/work-programs");
    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui program kerja: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deleteWorkProgramAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "delete", "work_programs")) {
    return { success: false, message: "Akses ditolak." };
  }

  try {
    await prisma.workProgram.delete({ where: { id } });
    await writeAuditLog({
      userId: session.user.id,
      action: "DELETE_WORK_PROGRAM",
      resource: "work_programs",
      resourceId: id,
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/work-programs");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menghapus program kerja: " + (err instanceof Error ? err.message : String(err)) };
  }
}
