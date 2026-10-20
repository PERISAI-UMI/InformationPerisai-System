"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { roleSchema, type RoleInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Membuat peran kustom baru beserta hak akses granular dan penetapan akun pengguna
 */
export async function createRoleAction(data: RoleInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "users:assign_role")) {
    return {
      success: false,
      message: "Akses ditolak: Hanya Super Admin yang berhak mengelola peran dan izin sistem.",
    };
  }

  const parsed = roleSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data peran tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const normalizedName = parsed.data.name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  try {
    const existing = await prisma.mRole.findUnique({
      where: { namaRole: normalizedName },
    });

    if (existing) {
      return {
        success: false,
        message: `Peran dengan nama kode '${normalizedName}' sudah ada. Gunakan nama yang berbeda.`,
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const permissionsJson = JSON.stringify(parsed.data.permissions);

    const newRole = await prisma.mRole.create({
      data: {
        namaRole: normalizedName,
        label: parsed.data.label.trim(),
        deskripsi: parsed.data.description?.trim() || null,
        permissions: permissionsJson,
        isSystem: false,
        createdAt: now,
        updatedAt: now,
      },
    });

    // Tetapkan pengguna ke peran baru jika ada
    if (parsed.data.assignedUserIds && parsed.data.assignedUserIds.length > 0) {
      await prisma.mAkun.updateMany({
        where: {
          idPerisai: { in: parsed.data.assignedUserIds },
        },
        data: {
          idRole: newRole.idRole,
          updatedAt: now,
        },
      });
    }

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_ROLE",
      resource: "roles",
      resourceId: String(newRole.idRole),
      details: {
        name: newRole.namaRole,
        permissionsCount: parsed.data.permissions.length,
        assignedUsersCount: parsed.data.assignedUserIds?.length || 0,
      },
    });

    revalidatePath("/admin/roles");
    revalidatePath("/admin/users");
    return { success: true, data: { id: newRole.idRole, name: newRole.namaRole } };
  } catch (err: unknown) {
    return {
      success: false,
      message: "Gagal membuat peran: " + (err instanceof Error ? err.message : String(err)),
    };
  }
}

/**
 * Memperbarui data peran, matriks hak akses, dan anggota pengguna yang terikat
 */
export async function updateRoleAction(
  id: number | string,
  data: RoleInput
): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "users:assign_role")) {
    return {
      success: false,
      message: "Akses ditolak: Hanya Super Admin yang berhak mengelola peran dan izin sistem.",
    };
  }

  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(numId)) {
    return { success: false, message: "ID peran tidak valid." };
  }

  const parsed = roleSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data peran tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await prisma.mRole.findUnique({
      where: { idRole: numId },
      include: {
        akun: {
          select: { idPerisai: true },
        },
      },
    });

    if (!existing) {
      return { success: false, message: "Peran tidak ditemukan." };
    }

    const now = Math.floor(Date.now() / 1000);
    const normalizedName = existing.isSystem
      ? existing.namaRole // Peran sistem tidak boleh diubah nama kodenya demi stabilitas sistem
      : parsed.data.name.trim().toUpperCase().replace(/\s+/g, "_");

    // Jika nama peran kustom diubah, pastikan tidak menabrak peran lain
    if (!existing.isSystem && normalizedName !== existing.namaRole) {
      const duplicate = await prisma.mRole.findUnique({
        where: { namaRole: normalizedName },
      });
      if (duplicate && duplicate.idRole !== numId) {
        return {
          success: false,
          message: `Peran dengan nama kode '${normalizedName}' sudah ada.`,
        };
      }
    }

    const permissionsJson = JSON.stringify(parsed.data.permissions);

    const updatedRole = await prisma.mRole.update({
      where: { idRole: numId },
      data: {
        namaRole: normalizedName,
        label: parsed.data.label.trim(),
        deskripsi: parsed.data.description?.trim() || null,
        permissions: permissionsJson,
        updatedAt: now,
      },
    });

    // Kelola alokasi akun pengguna (User Assignment)
    const targetUserIds = new Set(parsed.data.assignedUserIds || []);
    const currentUserIds = new Set(existing.akun.map((a) => a.idPerisai));

    // Akun yang baru ditambahkan ke peran ini
    const toAdd = [...targetUserIds].filter((uid) => !currentUserIds.has(uid));
    if (toAdd.length > 0) {
      await prisma.mAkun.updateMany({
        where: { idPerisai: { in: toAdd } },
        data: { idRole: numId, updatedAt: now },
      });
    }

    // Akun yang dikeluarkan dari peran ini (fallback ke role default EDITOR id: 4 atau ANGGOTA id: 5)
    const toRemove = [...currentUserIds].filter((uid) => !targetUserIds.has(uid));
    if (toRemove.length > 0 && !existing.isSystem) {
      const defaultRole = await prisma.mRole.findFirst({
        where: { namaRole: "EDITOR" },
      });
      const fallbackRoleId = defaultRole ? defaultRole.idRole : 4;

      await prisma.mAkun.updateMany({
        where: { idPerisai: { in: toRemove } },
        data: { idRole: fallbackRoleId, updatedAt: now },
      });
    }

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_ROLE",
      resource: "roles",
      resourceId: String(numId),
      details: {
        name: updatedRole.namaRole,
        permissionsCount: parsed.data.permissions.length,
        assignedUsersCount: targetUserIds.size,
      },
    });

    revalidatePath("/admin/roles");
    revalidatePath("/admin/users");
    return { success: true, data: { id: updatedRole.idRole, name: updatedRole.namaRole } };
  } catch (err: unknown) {
    return {
      success: false,
      message: "Gagal memperbarui peran: " + (err instanceof Error ? err.message : String(err)),
    };
  }
}

/**
 * Menghapus peran kustom (failsafe: menolak jika peran sistem atau masih memiliki pengguna terikat)
 */
export async function deleteRoleAction(id: number | string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "users:assign_role")) {
    return {
      success: false,
      message: "Akses ditolak: Hanya Super Admin yang berhak menghapus peran.",
    };
  }

  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(numId)) {
    return { success: false, message: "ID peran tidak valid." };
  }

  try {
    const existing = await prisma.mRole.findUnique({
      where: { idRole: numId },
      include: {
        _count: {
          select: { akun: true },
        },
      },
    });

    if (!existing) {
      return { success: false, message: "Peran tidak ditemukan." };
    }

    // Failsafe 1: Peran sistem tidak boleh dihapus
    if (existing.isSystem) {
      return {
        success: false,
        message: "Peran sistem ('" + existing.namaRole + "') terproteksi dan tidak dapat dihapus.",
      };
    }

    // Failsafe 2: Peran yang masih digunakan oleh akun tidak boleh dihapus
    if (existing._count.akun > 0) {
      return {
        success: false,
        message: `Peran tidak dapat dihapus karena masih digunakan oleh ${existing._count.akun} akun pengguna. Pindahkan akun tersebut ke peran lain terlebih dahulu.`,
      };
    }

    await prisma.mRole.delete({
      where: { idRole: numId },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "DELETE_ROLE",
      resource: "roles",
      resourceId: String(numId),
      details: { name: existing.namaRole },
    });

    revalidatePath("/admin/roles");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      message: "Gagal menghapus peran: " + (err instanceof Error ? err.message : String(err)),
    };
  }
}
