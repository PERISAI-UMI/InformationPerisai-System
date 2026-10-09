"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/lib/audit";
import { departmentSchema, type DepartmentInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createDepartmentAction(data: DepartmentInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "create", "departments")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = departmentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  try {
    const existingDept = await prisma.department.findFirst({
      where: { nama: parsed.data.name },
    });

    if (!existingDept) {
      return {
        success: false,
        message: "Departemen ini tidak terdaftar di database PSDM. Harap hubungi admin PSDM untuk mendaftarkan departemen di sistem utama.",
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const profile = await prisma.departmentProfile.upsert({
      where: { departmentId: existingDept.id },
      update: {
        slug,
        shortDescription: parsed.data.description?.slice(0, 250) || null,
        description: parsed.data.description || null,
        sortOrder: parsed.data.orderIndex ?? 0,
        isActive: 1,
        updatedAt: now,
      },
      create: {
        departmentId: existingDept.id,
        slug,
        shortDescription: parsed.data.description?.slice(0, 250) || null,
        description: parsed.data.description || null,
        sortOrder: parsed.data.orderIndex ?? 0,
        isActive: 1,
        createdAt: now,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_DEPARTMENT_PROFILE",
      resource: "departments",
      resourceId: existingDept.id,
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/departments");
    return { success: true, data: profile };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan profil departemen: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updateDepartmentAction(id: string, data: DepartmentInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "departments")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = departmentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);
    const now = Math.floor(Date.now() / 1000);

    const profile = await prisma.departmentProfile.upsert({
      where: { departmentId: id },
      update: {
        slug,
        shortDescription: parsed.data.description?.slice(0, 250) || null,
        description: parsed.data.description || null,
        sortOrder: parsed.data.orderIndex ?? 0,
        updatedAt: now,
      },
      create: {
        departmentId: id,
        slug,
        shortDescription: parsed.data.description?.slice(0, 250) || null,
        description: parsed.data.description || null,
        sortOrder: parsed.data.orderIndex ?? 0,
        isActive: 1,
        createdAt: now,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_DEPARTMENT_PROFILE",
      resource: "departments",
      resourceId: id,
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/departments");
    return { success: true, data: profile };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui profil departemen: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deleteDepartmentAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "delete", "departments")) {
    return { success: false, message: "Akses ditolak." };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    // Nonaktifkan profil website daripada menghapus departemen utama PSDM
    await prisma.departmentProfile.update({
      where: { departmentId: id },
      data: { isActive: 0, updatedAt: now },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "DEACTIVATE_DEPARTMENT_PROFILE",
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
