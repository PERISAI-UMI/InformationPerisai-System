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

    await prisma.auditLog.create({
      data: {
        userId: payload.userId || null,
        action: payload.action,
        entityType: payload.resource,
        entityId: payload.resourceId || null,
        changes: detailsString,
        ipHash: payload.ipAddress || null,
        createdAt: Math.floor(Date.now() / 1000),
      },
    });
  } catch (error) {
    console.error("Gagal mencatat audit log:", error);
  }
}
