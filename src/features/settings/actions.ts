"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(
  settings: Array<{ key: string; value: string; isPublic?: boolean }>
): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "settings")) {
    return { success: false, message: "Akses ditolak." };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    for (const item of settings) {
      await prisma.setting.upsert({
        where: { key: item.key },
        update: { value: item.value, updatedBy: session.user.id, updatedAt: now },
        create: { key: item.key, value: item.value, updatedBy: session.user.id, updatedAt: now },
      });
    }

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_SETTINGS",
      resource: "settings",
      details: { count: settings.length },
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan pengaturan: " + (err instanceof Error ? err.message : String(err)) };
  }
}
