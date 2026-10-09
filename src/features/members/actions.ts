"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { memberSchema, type MemberInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createMemberAction(data: MemberInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "create", "members")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = memberSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const member = await prisma.member.create({
      data: {
        name: parsed.data.name,
        position: parsed.data.roleOrTitle,
        periodId: parsed.data.periodId,
        departmentId: parsed.data.departmentId || null,
        photoMediaId: parsed.data.avatarUrl || null,
        sortOrder: parsed.data.orderIndex ?? 0,
        isActive: parsed.data.isActive ? 1 : 0,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_MEMBER",
      resource: "members",
      resourceId: member.id,
    });

    revalidatePath("/tentang");
    revalidatePath("/admin/members");
    return { success: true, data: member };
  } catch (err: unknown) {
    return { success: false, message: "Gagal menyimpan pengurus: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function updateMemberAction(id: string, data: MemberInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "update", "members")) {
    return { success: false, message: "Akses ditolak." };
  }

  const parsed = memberSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const updated = await prisma.member.update({
      where: { id },
      data: {
        name: parsed.data.name,
        position: parsed.data.roleOrTitle,
        periodId: parsed.data.periodId,
        departmentId: parsed.data.departmentId || null,
        photoMediaId: parsed.data.avatarUrl || null,
        sortOrder: parsed.data.orderIndex ?? 0,
        isActive: parsed.data.isActive ? 1 : 0,
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
    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, message: "Gagal memperbarui pengurus: " + (err instanceof Error ? err.message : String(err)) };
  }
}

export async function deleteMemberAction(id: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !can(session.user, "delete", "members")) {
    return { success: false, message: "Akses ditolak." };
  }

  try {
    await prisma.member.delete({ where: { id } });
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
