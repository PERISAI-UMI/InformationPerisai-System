"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/lib/audit";
import { opportunitySchema, type OpportunityInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createOpportunityAction(data: OpportunityInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "create", "opportunities")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin menambah peluang." };
  }

  const parsed = opportunitySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title);

  try {
    const now = Math.floor(Date.now() / 1000);
    const deadlineAt = parsed.data.deadlineAt
      ? Math.floor(new Date(parsed.data.deadlineAt).getTime() / 1000)
      : null;

    const opp = await prisma.opportunity.create({
      data: {
        title: parsed.data.title,
        slug,
        organizer: parsed.data.organizer,
        description: parsed.data.description,
        registrationUrl: parsed.data.linkUrl || null,
        deadlineAt,
        category: parsed.data.category,
        posterMediaId: parsed.data.coverImageUrl,
        createdBy: session.user.id,
        updatedBy: session.user.id,
        createdAt: now,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_OPPORTUNITY",
      resource: "opportunities",
      resourceId: opp.id,
    });

    revalidatePath("/peluang");
    revalidatePath("/admin/opportunities");
    return { success: true, data: opp };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan peluang: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updateOpportunityAction(id: string, data: OpportunityInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "opportunities")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = opportunitySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const deadlineAt = parsed.data.deadlineAt
      ? Math.floor(new Date(parsed.data.deadlineAt).getTime() / 1000)
      : null;

    const updated = await prisma.opportunity.update({
      where: { id },
      data: {
        title: parsed.data.title,
        organizer: parsed.data.organizer,
        description: parsed.data.description,
        registrationUrl: parsed.data.linkUrl || null,
        deadlineAt,
        category: parsed.data.category,
        posterMediaId: parsed.data.coverImageUrl,
        updatedBy: session.user.id,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_OPPORTUNITY",
      resource: "opportunities",
      resourceId: id,
    });

    revalidatePath("/peluang");
    revalidatePath("/admin/opportunities");
    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui peluang: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deleteOpportunityAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "delete", "opportunities")) {
    return { success: false, message: "Akses ditolak." };
  }

  try {
    await prisma.opportunity.delete({ where: { id } });
    await writeAuditLog({
      userId: session.user.id,
      action: "DELETE_OPPORTUNITY",
      resource: "opportunities",
      resourceId: id,
    });

    revalidatePath("/peluang");
    revalidatePath("/admin/opportunities");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menghapus peluang: " + (err instanceof Error ? err.message : String(err)) };
  }
}
