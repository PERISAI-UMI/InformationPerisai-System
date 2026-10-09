import { notFound } from "next/navigation";
import { getAdminInboxMessageById } from "@/features/inbox/queries.admin";
import { MessageDetail } from "@/features/inbox/components/MessageDetail";

export default async function AdminInboxDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await getAdminInboxMessageById(id);

  if (!message) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <MessageDetail
        message={{
          id: message.id,
          name: message.name,
          email: message.email,
          subject: message.subject,
          message: message.message,
          createdAt: new Date(message.createdAt * 1000),
          isRead: Boolean(message.isRead),
        }}
      />
    </div>
  );
}
