"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { transactionSchema, type TransactionInput } from "./schema";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createTransactionAction(data: TransactionInput): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "finance:create")) {
    return { success: false, message: "Akses ditolak. Anda tidak memiliki izin untuk mencatat transaksi keuangan." };
  }

  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data transaksi tidak valid",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    let dicatatOleh: string | null = null;
    if (session.user.id) {
      const anggota = await prisma.mAnggota.findUnique({
        where: { idPerisai: session.user.id },
        select: { idPerisai: true },
      });
      if (anggota) {
        dicatatOleh = anggota.idPerisai;
      }
    }

    const transaction = await prisma.tKeuangan.create({
      data: {
        idPeriode: parsed.data.idPeriode,
        jenisTransaksi: parsed.data.jenisTransaksi,
        kategori: parsed.data.kategori,
        nominal: parsed.data.nominal,
        keterangan: parsed.data.keterangan,
        tanggalTransaksi: parsed.data.tanggalTransaksi,
        buktiNota: parsed.data.buktiNota || null,
        dicatatOleh,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "CREATE_TRANSACTION",
      resource: "finance",
      resourceId: String(transaction.idTransaksi),
      details: {
        jenis: transaction.jenisTransaksi,
        nominal: transaction.nominal,
        kategori: transaction.kategori,
      },
    });

    revalidatePath("/admin/finance");
    return { success: true, data: transaction };
  } catch (err: unknown) {
    return {
      success: false,
      message: "Gagal menyimpan transaksi: " + (err instanceof Error ? err.message : String(err)),
    };
  }
}

export async function updateTransactionAction(
  id: number | string,
  data: TransactionInput
): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "finance:update")) {
    return { success: false, message: "Akses ditolak. Anda tidak memiliki izin untuk mengubah transaksi keuangan." };
  }

  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(numId)) {
    return { success: false, message: "ID transaksi tidak valid." };
  }

  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data transaksi tidak valid",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await prisma.tKeuangan.findUnique({
      where: { idTransaksi: numId },
    });
    if (!existing) {
      return { success: false, message: "Transaksi tidak ditemukan." };
    }

    const updated = await prisma.tKeuangan.update({
      where: { idTransaksi: numId },
      data: {
        idPeriode: parsed.data.idPeriode,
        jenisTransaksi: parsed.data.jenisTransaksi,
        kategori: parsed.data.kategori,
        nominal: parsed.data.nominal,
        keterangan: parsed.data.keterangan,
        tanggalTransaksi: parsed.data.tanggalTransaksi,
        buktiNota: parsed.data.buktiNota || null,
        updatedAt: Math.floor(Date.now() / 1000),
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "UPDATE_TRANSACTION",
      resource: "finance",
      resourceId: String(numId),
      details: {
        jenis: updated.jenisTransaksi,
        nominal: updated.nominal,
        kategori: updated.kategori,
      },
    });

    revalidatePath("/admin/finance");
    return { success: true, data: updated };
  } catch (err: unknown) {
    return {
      success: false,
      message: "Gagal memperbarui transaksi: " + (err instanceof Error ? err.message : String(err)),
    };
  }
}

export async function deleteTransactionAction(id: number | string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !hasPermission(session.user, "finance:delete")) {
    return { success: false, message: "Akses ditolak. Anda tidak memiliki izin untuk menghapus transaksi keuangan." };
  }

  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(numId)) {
    return { success: false, message: "ID transaksi tidak valid." };
  }

  try {
    const existing = await prisma.tKeuangan.findUnique({
      where: { idTransaksi: numId },
    });
    if (!existing) {
      return { success: false, message: "Transaksi tidak ditemukan." };
    }

    await prisma.tKeuangan.delete({
      where: { idTransaksi: numId },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "DELETE_TRANSACTION",
      resource: "finance",
      resourceId: String(numId),
      details: {
        jenis: existing.jenisTransaksi,
        nominal: existing.nominal,
        keterangan: existing.keterangan,
      },
    });

    revalidatePath("/admin/finance");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      message: "Gagal menghapus transaksi: " + (err instanceof Error ? err.message : String(err)),
    };
  }
}
