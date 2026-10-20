"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { memberSchema, type MemberInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createMemberAction(data: MemberInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "members:create")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin menambah anggota/pengurus." };
  }

  const parsed = memberSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const periodId = parseInt(parsed.data.periodId, 10) || 1;
    const deptId = parsed.data.departmentId ? parseInt(parsed.data.departmentId, 10) : null;

    // Cari atau buat jabatan
    let jabatan = await prisma.mJabatan.findFirst({
      where: { namaJabatan: parsed.data.roleOrTitle },
    });
    if (!jabatan) {
      jabatan = await prisma.mJabatan.create({
        data: {
          namaJabatan: parsed.data.roleOrTitle,
          idDepartemen: deptId,
          levelHirarki: 4,
        },
      });
    }

    // Buat ID anggota yang unik untuk mencegah collision pada id_perisai dan nim
    const uniqueSuffix = `${Date.now().toString().slice(-4)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const prnId = `PRN${uniqueSuffix}`;

    // Jalankan dalam transaksi agar mAnggota dan tKepengurusan tercipta secara atomik
    const { anggota, kepengurusan } = await prisma.$transaction(async (tx) => {
      const newAnggota = await tx.mAnggota.create({
        data: {
          idPerisai: prnId,
          namaLengkap: parsed.data.name,
          nim: prnId,
          angkatan: 2024,
          gen: 11,
          email: `${prnId.toLowerCase()}@perisai.umi.ac.id`,
          fotoUrl: parsed.data.avatarUrl || null,
          status: parsed.data.isActive ? "aktif" : "cuti",
        },
      });

      const newKepengurusan = await tx.tKepengurusan.create({
        data: {
          idPeriode: periodId,
          idPerisai: newAnggota.idPerisai,
          idJabatan: jabatan.idJabatan,
          idDepartemen: deptId,
          status: parsed.data.isActive ? "aktif" : "cuti",
          urutan: parsed.data.orderIndex ?? 0,
        },
      });

      return { anggota: newAnggota, kepengurusan: newKepengurusan };
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_MEMBER",
      resource: "members",
      resourceId: String(kepengurusan.idKepengurusan),
    });

    revalidatePath("/tentang");
    revalidatePath("/admin/members");
    return { success: true, data: { id: String(kepengurusan.idKepengurusan), ...kepengurusan } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan pengurus: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updateMemberAction(id: string, data: MemberInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "members:update")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin mengubah data pengurus." };
  }

  const parsed = memberSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { success: false, message: "ID pengurus tidak valid." };

  try {
    const existing = await prisma.tKepengurusan.findUnique({
      where: { idKepengurusan: numId },
    });
    if (!existing) return { success: false, message: "Data kepengurusan tidak ditemukan." };

    const deptId = parsed.data.departmentId ? parseInt(parsed.data.departmentId, 10) : null;
    const periodId = parseInt(parsed.data.periodId, 10) || existing.idPeriode;

    await prisma.mAnggota.update({
      where: { idPerisai: existing.idPerisai },
      data: {
        namaLengkap: parsed.data.name,
        fotoUrl: parsed.data.avatarUrl || null,
        status: parsed.data.isActive ? "aktif" : "cuti",
      },
    });

    const updated = await prisma.tKepengurusan.update({
      where: { idKepengurusan: numId },
      data: {
        idDepartemen: deptId,
        idPeriode: periodId,
        status: parsed.data.isActive ? "aktif" : "cuti",
        urutan: parsed.data.orderIndex ?? 0,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_MEMBER",
      resource: "members",
      resourceId: id,
    });

    revalidatePath("/tentang");
    revalidatePath("/admin/members");
    return { success: true, data: { id: String(updated.idKepengurusan), ...updated } };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui pengurus: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deleteMemberAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "members:delete")) {
    return { success: false, message: "Akses ditolak: Anda tidak memiliki izin menghapus pengurus." };
  }

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { success: false, message: "ID pengurus tidak valid." };

  try {
    await prisma.tKepengurusan.delete({ where: { idKepengurusan: numId } });
    await writeAuditLog({
      userId: session.user.id,
      action: "DELETE_MEMBER",
      resource: "members",
      resourceId: id,
    });

    revalidatePath("/tentang");
    revalidatePath("/admin/members");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menghapus pengurus: " + (err instanceof Error ? err.message : String(err)) };
  }
}
