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
    <div className="flex h-screen w-full overflow-hidden bg-[#16161a] text-white selection:bg-[#FFB22C] selection:text-[#1b1b1f]">
      {/* Sidebar Nav (Fixed) */}
      <AdminSidebar user={session.user} userRole={session.user.role} />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        <AdminTopbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
          <div className="max-w-7xl w-full mx-auto pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
