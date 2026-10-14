"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { slugify, generateUniqueSlug } from "@/lib/slug";
import { writeAuditLog } from "@/lib/audit";
import { workProgramSchema, type WorkProgramInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createWorkProgramAction(data: WorkProgramInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "create", "work_programs")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin mengelola program kerja." };
  }

  const parsed = workProgramSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const slug = await generateUniqueSlug("tProker", parsed.data.slug || parsed.data.name);

  try {
    const now = Math.floor(Date.now() / 1000);
    const deptId = parseInt(parsed.data.departmentId, 10);
    let periodId = parseInt(parsed.data.periodId, 10);

    if (isNaN(periodId)) {
      const activePeriode = await prisma.mPeriode.findFirst({ where: { isActive: 1 } });
      periodId = activePeriode ? activePeriode.idPeriode : 1;
    }

    const proker = await prisma.tProker.create({
      data: {
        idDepartemen: isNaN(deptId) ? 1 : deptId,
        idPeriode: periodId,
        namaProker: parsed.data.name,
        slug,
        deskripsi: parsed.data.description,
        targetPelaksanaan: parsed.data.targetDate || null,
        indikatorKeberhasilan: parsed.data.objectives || null,
        fotoCover: parsed.data.coverImageUrl || null,
        status: parsed.data.status.toLowerCase(),
        diperbaruiOleh: session.user.id,
        createdAt: now,
        updatedAt: now,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_WORK_PROGRAM",
      resource: "work_programs",
      resourceId: String(proker.idProker),
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/work-programs");
    return { success: true, data: { id: String(proker.idProker), slug: proker.slug } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan program kerja: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updateWorkProgramAction(id: string, data: WorkProgramInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "work_programs")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = workProgramSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return { success: false, message: "ID program kerja tidak valid." };
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const deptId = parseInt(parsed.data.departmentId, 10);
    let periodId = parseInt(parsed.data.periodId, 10);

    const updateData: {
      namaProker: string;
      deskripsi: string;
      fotoCover: string | null;
      status: string;
      targetPelaksanaan: string | null;
      indikatorKeberhasilan: string | null;
      diperbaruiOleh: string;
      updatedAt: number;
      idDepartemen?: number;
      idPeriode?: number;
    } = {
      namaProker: parsed.data.name,
      deskripsi: parsed.data.description,
      fotoCover: parsed.data.coverImageUrl || null,
      status: parsed.data.status.toLowerCase(),
      targetPelaksanaan: parsed.data.targetDate || null,
      indikatorKeberhasilan: parsed.data.objectives || null,
      diperbaruiOleh: session.user.id,
      updatedAt: now,
    };

    if (!isNaN(deptId)) updateData.idDepartemen = deptId;
    if (!isNaN(periodId)) updateData.idPeriode = periodId;

    const updated = await prisma.tProker.update({
      where: { idProker: idNum },
      data: updateData,
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_WORK_PROGRAM",
      resource: "work_programs",
      resourceId: id,
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/work-programs");
    return { success: true, data: { id: String(updated.idProker), slug: updated.slug } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui program kerja: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deleteWorkProgramAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "delete", "work_programs")) {
    return { success: false, message: "Akses ditolak." };
  }

  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return { success: false, message: "ID program kerja tidak valid." };
  }

  try {
    await prisma.tProker.delete({ where: { idProker: idNum } });
    await writeAuditLog({
      userId: session.user.id,
      action: "DELETE_WORK_PROGRAM",
      resource: "work_programs",
      resourceId: id,
    });

    revalidatePath("/tentang/sumber-daya");
    revalidatePath("/admin/work-programs");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menghapus program kerja: " + (err instanceof Error ? err.message : String(err)) };
  }
}
