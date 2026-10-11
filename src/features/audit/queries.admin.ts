import prisma from "@/lib/db";

export async function getAdminAuditLogs({ page = 1, pageSize = 10 } = {}) {
  const skip = (page - 1) * pageSize;

  const [itemsRaw, total] = await Promise.all([
    prisma.tAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.tAuditLog.count(),
  ]);

  const items = itemsRaw.map((log) => ({
    id: String(log.idLog),
    action: log.aksi,
    resource: log.entitas,
    entityId: log.idEntitas,
    details: log.dataBaru || log.dataLama,
    ipHash: log.ipAddress,
    createdAt: log.createdAt,
    user: { name: log.idAkun ? `Pengurus #${log.idAkun}` : "Sistem", email: "" },
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
