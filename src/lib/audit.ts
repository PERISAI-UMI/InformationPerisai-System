import prisma from "./db";

export interface AuditLogPayload {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: Record<string, unknown> | string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function writeAuditLog(payload: AuditLogPayload): Promise<void> {
  try {
    const detailsString =
      typeof payload.details === "object" && payload.details !== null
        ? JSON.stringify(payload.details)
        : (payload.details as string) || null;

    await prisma.tAuditLog.create({
      data: {
        aksi: payload.action,
        entitas: payload.resource,
        idEntitas: payload.resourceId || null,
        dataBaru: detailsString,
        ipAddress: payload.ipAddress || null,
        userAgent: payload.userAgent || null,
        createdAt: Math.floor(Date.now() / 1000),
      },
    });
  } catch (error) {
    console.error("Gagal mencatat audit log:", error);
  }
}
