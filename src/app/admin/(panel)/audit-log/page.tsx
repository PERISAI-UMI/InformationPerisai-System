import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminAuditLogs } from "@/features/audit/queries.admin";
import { AuditTable } from "@/features/audit/components/AuditTable";
import { Pagination } from "@/components/common/Pagination";

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminAuditLogs({ page, pageSize: 30 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Catatan Jejak Audit Sistem
        </h1>
        <p className="text-sm text-zinc-500">
          Khusus Admin Utama: rekam jejak aktivitas penambahan, pembaruan, dan penghapusan data.
        </p>
      </div>

      <AuditTable
        logs={data.items.map((log) => ({
          id: String(log.id),
          action: log.action,
          resource: log.resource,
          resourceId: log.entityId,
          details: log.details,
          ipAddress: log.ipHash,
          createdAt: new Date(log.createdAt * 1000),
          user: log.user,
        }))}
      />

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        createPageUrl={(p) => `/admin/audit-log?page=${p}`}
      />
    </div>
  );
}
