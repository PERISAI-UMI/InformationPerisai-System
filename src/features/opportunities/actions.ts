"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { slugify, generateUniqueSlug } from "@/lib/slug";
import { writeAuditLog } from "@/lib/audit";
import { opportunitySchema, type OpportunityInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createOpportunityAction(data: OpportunityInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "opportunities:create")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin menambah peluang." };
  }

  const parsed = opportunitySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const slug = await generateUniqueSlug("tKompetisi", parsed.data.slug || parsed.data.title);

  try {
    const now = Math.floor(Date.now() / 1000);
    const deadlineAt = parsed.data.deadlineAt
      ? Math.floor(new Date(parsed.data.deadlineAt).getTime() / 1000)
      : null;

    const opp = await prisma.tKompetisi.create({
      data: {
        namaKompetisi: parsed.data.title,
        slug,
        penyelenggara: parsed.data.organizer,
        deskripsi: parsed.data.description,
        linkPendaftaran: parsed.data.linkUrl || null,
        deadlinePendaftaran: deadlineAt,
        kategori: parsed.data.category,
        tipe: parsed.data.category.toLowerCase(),
        linkPoster: parsed.data.coverImageUrl || null,
        status: "published",
        penulisId: session.user.id,
        diperbaruiOleh: session.user.id,
        createdAt: now,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_OPPORTUNITY",
      resource: "opportunities",
      resourceId: String(opp.idKompetisi),
    });

    revalidatePath("/peluang");
    revalidatePath("/admin/opportunities");
    return { success: true, data: { id: String(opp.idKompetisi), slug: opp.slug } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan peluang: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updateOpportunityAction(id: string, data: OpportunityInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "opportunities:update")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = opportunitySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return { success: false, message: "ID peluang tidak valid." };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const deadlineAt = parsed.data.deadlineAt
      ? Math.floor(new Date(parsed.data.deadlineAt).getTime() / 1000)
      : null;

    const updated = await prisma.tKompetisi.update({
      where: { idKompetisi: idNum },
      data: {
        namaKompetisi: parsed.data.title,
        penyelenggara: parsed.data.organizer,
        deskripsi: parsed.data.description,
        linkPendaftaran: parsed.data.linkUrl || null,
        deadlinePendaftaran: deadlineAt,
        kategori: parsed.data.category,
        tipe: parsed.data.category.toLowerCase(),
        linkPoster: parsed.data.coverImageUrl || null,
        diperbaruiOleh: session.user.id,
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
    return { success: true, data: { id: String(updated.idKompetisi), slug: updated.slug } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui peluang: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deleteOpportunityAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "opportunities:delete")) {
    return { success: false, message: "Akses ditolak." };
  }

  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return { success: false, message: "ID peluang tidak valid." };
  }

  try {
    await prisma.tKompetisi.delete({ where: { idKompetisi: idNum } });
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
