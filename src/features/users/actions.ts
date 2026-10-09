"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { scryptSync, randomBytes } from "crypto";
import { userSchema, type UserInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function createUserAction(data: UserInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "create", "users")) {
    return { success: false, message: "Akses ditolak: Hanya Super Admin yang berhak mengelola akun pengguna." };
  }

  const parsed = userSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!existing) {
      return { success: false, message: "Akun pengurus belum ada di sistem database PSDM. Pastikan email terdaftar di data pengurus." };
    }

    const now = Math.floor(Date.now() / 1000);
    const cmsRole = parsed.data.role.toLowerCase();

    await prisma.userAccess.upsert({
      where: { userId: existing.id },
      update: { cmsRole, updatedAt: now },
      create: { userId: existing.id, cmsRole, createdAt: now, updatedAt: now },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "ASSIGN_USER_ACCESS",
      resource: "users",
      resourceId: existing.id,
      details: { email: existing.email, role: cmsRole },
    });

    revalidatePath("/admin/users");
    return { success: true, data: existing };
  } catch (err: unknown) {
    return { success: false, message: "Gagal mengatur hak akses pengguna: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updateUserAction(id: string, data: UserInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "users")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = userSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const cmsRole = parsed.data.role.toLowerCase();

    await prisma.userAccess.upsert({
      where: { userId: id },
      update: { cmsRole, updatedAt: now },
      create: { userId: id, cmsRole, createdAt: now, updatedAt: now },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_USER_ACCESS",
      resource: "users",
      resourceId: id,
      details: { role: cmsRole },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui pengguna: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function toggleUserStatusAction(id: string, isActive: boolean): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "manage", "users")) {
    return { success: false, message: "Akses ditolak." };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const cmsRole = isActive ? "editor" : "none";

    await prisma.userAccess.upsert({
      where: { userId: id },
      update: { cmsRole, updatedAt: now },
      create: { userId: id, cmsRole, createdAt: now, updatedAt: now },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: isActive ? "ACTIVATE_USER_CMS" : "DEACTIVATE_USER_CMS",
      resource: "users",
      resourceId: id,
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal mengubah status: " + (err instanceof Error ? err.message : String(err)) };
  }
}
