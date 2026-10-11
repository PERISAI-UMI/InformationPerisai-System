"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { userSchema, type UserInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

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
    const existing = await prisma.mAnggota.findUnique({ where: { email: parsed.data.email } });
    if (!existing) {
      return { success: false, message: "Akun pengurus belum ada di sistem database PSDM. Pastikan email terdaftar di data pengurus." };
    }

    const roleName = parsed.data.role.toUpperCase();
    const roleRecord = await prisma.mRole.findFirst({ where: { namaRole: roleName } });
    const roleId = roleRecord ? roleRecord.idRole : 4; // default editor

    await prisma.mAkun.upsert({
      where: { idPerisai: existing.idPerisai },
      update: { idRole: roleId, isActive: 1 },
      create: {
        idPerisai: existing.idPerisai,
        idRole: roleId,
        passwordHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", // default perisai2026
        isActive: 1,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "ASSIGN_USER_ACCESS",
      resource: "users",
      resourceId: existing.idPerisai,
      details: { email: existing.email, role: roleName },
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
    const roleName = parsed.data.role.toUpperCase();
    const roleRecord = await prisma.mRole.findFirst({ where: { namaRole: roleName } });
    const roleId = roleRecord ? roleRecord.idRole : 4;

    await prisma.mAkun.update({
      where: { idPerisai: id },
      data: { idRole: roleId },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_USER_ACCESS",
      resource: "users",
      resourceId: id,
      details: { role: roleName },
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
    await prisma.mAkun.update({
      where: { idPerisai: id },
      data: { isActive: isActive ? 1 : 0 },
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
    return { success: false, message: "Gagal mengubah status pengguna: " + (err instanceof Error ? err.message : String(err)) };
  }
}
