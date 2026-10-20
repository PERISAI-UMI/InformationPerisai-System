"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { slugify, generateUniqueSlug } from "@/lib/slug";
import { writeAuditLog } from "@/lib/audit";
import { departmentSchema, type DepartmentInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createDepartmentAction(data: DepartmentInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "departments:manage")) {
    return { success: false, message: "Akses ditolak: Hanya Super Admin / Pimpinan yang dapat membuat departemen." };
  }

  const parsed = departmentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const slug = await generateUniqueSlug("mDepartemen", parsed.data.slug || parsed.data.name);

  try {
    const now = Math.floor(Date.now() / 1000);
    const dept = await prisma.mDepartemen.create({
      data: {
        namaDepartemen: parsed.data.name,
        singkatan: parsed.data.code?.toUpperCase() || parsed.data.name.slice(0, 5).toUpperCase(),
        slug,
        deskripsiSingkat: parsed.data.description?.slice(0, 250) || null,
        tupoksiUtama: parsed.data.description || null,
        urutan: parsed.data.orderIndex ?? 0,
        isActive: 1,
        createdAt: now,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_DEPARTMENT",
      resource: "departments",
      resourceId: String(dept.idDepartemen),
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/departments");
    return { success: true, data: { id: String(dept.idDepartemen), slug: dept.slug } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan departemen: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updateDepartmentAction(id: string, data: DepartmentInput): Promise<ActionResponse> {
  const session = await getSession();
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return { success: false, message: "ID departemen tidak valid." };
  }

  if (!session || !hasPermission(session.user, "departments:update", { departmentId: idNum })) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin memperbarui data departemen ini." };
  }

  const parsed = departmentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const slug = await generateUniqueSlug("mDepartemen", parsed.data.slug || parsed.data.name, idNum);
    const now = Math.floor(Date.now() / 1000);

    const updated = await prisma.mDepartemen.update({
      where: { idDepartemen: idNum },
      data: {
        namaDepartemen: parsed.data.name,
        singkatan: parsed.data.code?.toUpperCase() || parsed.data.name.slice(0, 5).toUpperCase(),
        slug,
        deskripsiSingkat: parsed.data.description?.slice(0, 250) || null,
        tupoksiUtama: parsed.data.description || null,
        urutan: parsed.data.orderIndex ?? 0,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_DEPARTMENT",
      resource: "departments",
      resourceId: id,
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/departments");
    return { success: true, data: { id: String(updated.idDepartemen), slug: updated.slug } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui departemen: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deleteDepartmentAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "departments:manage")) {
    return { success: false, message: "Akses ditolak: Hanya Super Admin / Pimpinan yang dapat menonaktifkan departemen." };
  }

  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return { success: false, message: "ID departemen tidak valid." };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    // Nonaktifkan departemen daripada menghapus relasi
    await prisma.mDepartemen.update({
      where: { idDepartemen: idNum },
      data: { isActive: 0, updatedAt: now },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "DEACTIVATE_DEPARTMENT",
      resource: "departments",
      resourceId: id,
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/departments");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menonaktifkan departemen: " + (err instanceof Error ? err.message : String(err)) };
  }
}
