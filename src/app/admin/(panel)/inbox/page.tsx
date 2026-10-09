import { getAdminInbox } from "@/features/inbox/queries.admin";
import { InboxTable } from "@/features/inbox/components/InboxTable";
import { Pagination } from "@/components/common/Pagination";

export default async function AdminInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const data = await getAdminInbox({ page });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Kotak Masuk (Inbox)
          </h1>
          <p className="text-sm text-zinc-500">
            Pesan masuk dan pertanyaan dari pengunjung portal UKM PERISAI UMI.
          </p>
        </div>
        {data.unreadCount > 0 && (
          <span className="rounded-full bg-[#E6AF2E]/15 px-3 py-1 text-xs font-bold text-[#282F44] border border-[#E6AF2E]/30 dark:bg-[#E6AF2E]/25 dark:text-[#F5D061]">
            {data.unreadCount} pesan belum dibaca
          </span>
        )}
      </div>

      <InboxTable
        messages={data.items.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          isRead: Boolean(m.isRead),
          createdAt: new Date(m.createdAt * 1000),
        }))}
      />

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        createPageUrl={(p) => `/admin/inbox?page=${p}`}
      />
    </div>
  );
}
