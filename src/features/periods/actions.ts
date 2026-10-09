"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { periodSchema, type PeriodInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function createPeriodAction(data: PeriodInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "create", "periods")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = periodSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const period = await prisma.$transaction(async (tx: any) => {
      if (parsed.data.isActive) {
        // Hanya satu periode yang boleh aktif!
        await tx.period.updateMany({
          data: { isCurrent: 0 },
        });
      }

      return tx.period.create({
        data: {
          name: parsed.data.name,
          isCurrent: parsed.data.isActive ? 1 : 0,
          startDate: Math.floor(new Date(parsed.data.startDate).getTime() / 1000),
          endDate: parsed.data.endDate ? Math.floor(new Date(parsed.data.endDate).getTime() / 1000) : null,
        },
      });
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_PERIOD",
      resource: "periods",
      resourceId: period.id,
    });

    revalidatePath("/admin/periods");
    return { success: true, data: period };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan periode: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updatePeriodAction(id: string, data: PeriodInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "periods")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = periodSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const updated = await prisma.$transaction(async (tx: any) => {
      if (parsed.data.isActive) {
        // Nonaktifkan semua periode lain
        await tx.period.updateMany({
          where: { id: { not: id } },
          data: { isCurrent: 0 },
        });
      }

      return tx.period.update({
        where: { id },
        data: {
          name: parsed.data.name,
          isCurrent: parsed.data.isActive ? 1 : 0,
          startDate: Math.floor(new Date(parsed.data.startDate).getTime() / 1000),
          endDate: parsed.data.endDate ? Math.floor(new Date(parsed.data.endDate).getTime() / 1000) : null,
        },
      });
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_PERIOD",
      resource: "periods",
      resourceId: id,
    });

    revalidatePath("/admin/periods");
    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui periode: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function setActivePeriodAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "periods")) {
    return { success: false, message: "Akses ditolak." };
  }

  try {
    await prisma.$transaction([
      prisma.period.updateMany({ data: { isCurrent: 0 } }),
      prisma.period.update({ where: { id }, data: { isCurrent: 1 } }),
    ]);

    await writeAuditLog({
      userId: session.user.id,
      action: "SET_ACTIVE_PERIOD",
      resource: "periods",
      resourceId: id,
    });

    revalidatePath("/admin/periods");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal mengaktifkan periode: " + (err instanceof Error ? err.message : String(err)) };
  }
}
