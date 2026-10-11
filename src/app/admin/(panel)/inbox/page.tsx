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
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Kotak Masuk (Inbox)
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Pesan masuk dan pertanyaan dari pengunjung portal UKM PERISAI UMI.
          </p>
        </div>
        {data.unreadCount > 0 && (
          <span className="rounded-full bg-[#FFB22C]/10 px-3.5 py-1 text-xs font-bold text-[#FFB22C] border border-[#FFB22C]/20 shadow-sm flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FFB22C] animate-pulse" />
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
