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
    const sYear = new Date(parsed.data.startDate).getFullYear() || 2026;
    const eYear = parsed.data.endDate ? new Date(parsed.data.endDate).getFullYear() : sYear + 1;

    const period = await prisma.$transaction(async (tx: any) => {
      if (parsed.data.isActive) {
        await tx.mPeriode.updateMany({
          data: { isActive: 0 },
        });
      }

      return tx.mPeriode.create({
        data: {
          namaPeriode: parsed.data.name,
          isActive: parsed.data.isActive ? 1 : 0,
          tahunMulai: sYear,
          tahunSelesai: eYear,
        },
      });
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_PERIOD",
      resource: "periods",
      resourceId: String(period.idPeriode),
    });

    revalidatePath("/admin/periods");
    return { success: true, data: { id: String(period.idPeriode), ...period } };
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

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { success: false, message: "ID periode tidak valid." };

  try {
    const sYear = new Date(parsed.data.startDate).getFullYear() || 2026;
    const eYear = parsed.data.endDate ? new Date(parsed.data.endDate).getFullYear() : sYear + 1;

    const updated = await prisma.$transaction(async (tx: any) => {
      if (parsed.data.isActive) {
        await tx.mPeriode.updateMany({
          where: { idPeriode: { not: numId } },
          data: { isActive: 0 },
        });
      }

      return tx.mPeriode.update({
        where: { idPeriode: numId },
        data: {
          namaPeriode: parsed.data.name,
          isActive: parsed.data.isActive ? 1 : 0,
          tahunMulai: sYear,
          tahunSelesai: eYear,
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
    return { success: true, data: { id: String(updated.idPeriode), ...updated } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui periode: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function setActivePeriodAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "periods")) {
    return { success: false, message: "Akses ditolak." };
  }

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { success: false, message: "ID periode tidak valid." };

  try {
    await prisma.$transaction([
      prisma.mPeriode.updateMany({ data: { isActive: 0 } }),
      prisma.mPeriode.update({ where: { idPeriode: numId }, data: { isActive: 1 } }),
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
