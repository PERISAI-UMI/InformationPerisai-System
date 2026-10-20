"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { invalidateSettingsCache } from "./queries.public";

export async function updateSettingsAction(
  settings: Array<{ key: string; value: string; isPublic?: boolean }>
): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "settings:update")) {
    return { success: false, message: "Akses ditolak: Hanya Super Admin / Pengurus Berwenang yang dapat mengubah pengaturan." };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    await prisma.$transaction(
      settings.map((item) =>
        prisma.tPengaturan.upsert({
          where: { kunci: item.key },
          update: { nilai: item.value, diperbaruiOleh: session.user.id, updatedAt: now },
          create: { kunci: item.key, nilai: item.value, tipe: "string", diperbaruiOleh: session.user.id, updatedAt: now },
        })
      )
    );

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_SETTINGS",
      resource: "settings",
      details: { count: settings.length },
    });

    invalidateSettingsCache();
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan pengaturan: " + (err instanceof Error ? err.message : String(err)) };
  }
}
