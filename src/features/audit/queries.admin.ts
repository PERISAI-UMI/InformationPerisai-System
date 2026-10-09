import prisma from "@/lib/db";

export async function getAdminAuditLogs({ page = 1, pageSize = 30 } = {}) {
  const skip = (page - 1) * pageSize;

  const [itemsRaw, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.auditLog.count(),
  ]);

  const items = itemsRaw.map((log) => ({
    ...log,
    resource: log.entityType || "",
    details: log.changes,
    user: { name: log.userId ? "Pengurus" : "Sistem", email: "" },
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
