import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar userRole={session.user.role} />
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <AdminTopbar user={session.user} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
