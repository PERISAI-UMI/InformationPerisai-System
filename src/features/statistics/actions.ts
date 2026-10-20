"use server";

import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { statisticSchema, type StatisticInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createStatisticAction(data: StatisticInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "settings:update")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = statisticSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  revalidatePath("/");
  revalidatePath("/admin/statistics");
  return { success: true, message: "Statistik dihitung otomatis berdasarkan record riil sistem." };
}

export async function updateStatisticAction(id: string, data: StatisticInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "settings:update")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = statisticSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  revalidatePath("/");
  revalidatePath("/admin/statistics");
  return { success: true, message: "Statistik dihitung otomatis berdasarkan record riil sistem." };
}

export async function deleteStatisticAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "settings:update")) {
    return { success: false, message: "Akses ditolak." };
  }

  revalidatePath("/");
  revalidatePath("/admin/statistics");
  return { success: true, message: "Statistik dihitung otomatis berdasarkan record riil sistem." };
}
