"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { writeAuditLog } from "@/lib/audit";
import { contactSchema, type ContactInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function sendContactMessageAction(data: ContactInput): Promise<ActionResponse> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data formulir tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  // Rate Limiting berdasarkan email
  const rl = checkRateLimit(`contact-${parsed.data.email}`, { limit: 3, windowMs: 15 * 60 * 1000 });
  if (!rl.isAllowed) {
    return { success: false, message: "Terlalu banyak permintaan pesan. Silakan tunggu beberapa menit sebelum mencoba lagi." };
  }

  // Cloudflare Turnstile token validation jika ada
  if (parsed.data.turnstileToken) {
    const isHuman = await verifyTurnstileToken(parsed.data.turnstileToken);
    if (!isHuman) {
      return { success: false, message: "Verifikasi bot Turnstile gagal. Silakan coba kembali." };
    }
  }

  try {
    const message = await prisma.inboxMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        createdAt: Math.floor(Date.now() / 1000),
      },
    });

    return { success: true, message: "Pesan Anda berhasil dikirim ke pengurus UKM PERISAI UMI.", data: message };
  } catch (err: unknown) {
    return { success: false, message: "Gagal mengirim pesan: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function markAsReadAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "inbox")) {
    return { success: false, message: "Akses ditolak." };
  }

  try {
    await prisma.inboxMessage.update({
      where: { id },
      data: { isRead: 1, handledAt: Math.floor(Date.now() / 1000), handledBy: session.user.id },
    });

    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menandai pesan: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deleteMessageAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "delete", "inbox")) {
    return { success: false, message: "Akses ditolak." };
  }

  try {
    await prisma.inboxMessage.delete({ where: { id } });
    await writeAuditLog({
      userId: session.user.id,
      action: "DELETE_INBOX_MESSAGE",
      resource: "inbox",
      resourceId: id,
    });

    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menghapus pesan: " + (err instanceof Error ? err.message : String(err)) };
  }
}
