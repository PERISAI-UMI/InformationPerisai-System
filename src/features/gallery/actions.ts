"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { storage } from "@/lib/storage";
import { writeAuditLog } from "@/lib/audit";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function deleteMediaAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "gallery:delete")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin menghapus berkas galeri." };
  }

  try {
    const media = await prisma.tMedia.findUnique({ where: { idMedia: id } });
    if (!media) return { success: false, message: "Media tidak ditemukan." };

    await storage.delete(media.kunciPenyimpanan);
    await prisma.tMedia.delete({ where: { idMedia: id } });

    await writeAuditLog({
      userId: session.user.id,
      action: "DELETE_MEDIA",
      resource: "gallery",
      resourceId: id,
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menghapus berkas: " + (err instanceof Error ? err.message : String(err)) };
  }
}
