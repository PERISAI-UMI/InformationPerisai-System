"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { statisticSchema, type StatisticInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createStatisticAction(data: StatisticInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "create", "statistics")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = statisticSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const stat = await prisma.statistic.create({
      data: {
        label: parsed.data.label,
        value: String(parsed.data.value) + (parsed.data.suffix ? ` ${parsed.data.suffix}` : ""),
        description: parsed.data.icon || null,
        sortOrder: parsed.data.orderIndex,
        isActive: parsed.data.isActive ? 1 : 0,
        createdAt: now,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_STATISTIC",
      resource: "statistics",
      resourceId: stat.id,
    });

    revalidatePath("/");
    revalidatePath("/admin/statistics");
    return { success: true, data: stat };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan statistik: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updateStatisticAction(id: string, data: StatisticInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "statistics")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = statisticSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const updated = await prisma.statistic.update({
      where: { id },
      data: {
        label: parsed.data.label,
        value: String(parsed.data.value) + (parsed.data.suffix ? ` ${parsed.data.suffix}` : ""),
        description: parsed.data.icon || null,
        sortOrder: parsed.data.orderIndex,
        isActive: parsed.data.isActive ? 1 : 0,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_STATISTIC",
      resource: "statistics",
      resourceId: id,
    });

    revalidatePath("/");
    revalidatePath("/admin/statistics");
    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui statistik: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deleteStatisticAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "delete", "statistics")) {
    return { success: false, message: "Akses ditolak." };
  }

  try {
    await prisma.statistic.delete({ where: { id } });
    await writeAuditLog({
      userId: session.user.id,
      action: "DELETE_STATISTIC",
      resource: "statistics",
      resourceId: id,
    });

    revalidatePath("/");
    revalidatePath("/admin/statistics");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menghapus statistik: " + (err instanceof Error ? err.message : String(err)) };
  }
}
