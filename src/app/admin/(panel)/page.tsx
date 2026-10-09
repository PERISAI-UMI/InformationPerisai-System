import { getDashboardOverview } from "@/features/dashboard/queries.admin";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { ClosingSoonList } from "@/features/dashboard/components/ClosingSoonList";
import Link from "next/link";
import { formatDateIndonesian } from "@/lib/dates";

export default async function AdminDashboardPage() {
  const { stats, closingSoonOpportunities, recentPosts } = await getDashboardOverview();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
          Dasbor Pengurus
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Selamat datang kembali di panel administrasi UKM PERISAI UMI.
        </p>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Postingan"
          value={stats.totalPosts}
          icon="📰"
          description="Artikel & rilis berita"
        />
        <StatCard
          title="Program Kerja"
          value={stats.totalWorkPrograms}
          icon="📋"
          description="Seluruh proker terdaftar"
        />
        <StatCard
          title="Peluang Lomba"
          value={stats.totalOpportunities}
          icon="🏆"
          description="Lomba & beasiswa"
        />
        <StatCard
          title="Pesan Masuk Baru"
          value={stats.unreadMessages}
          icon="✉️"
          description="Pesan belum dibaca"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Postingan Terbaru */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Postingan Berita Terkini
            </h3>
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-[#E6AF2E] hover:text-[#b8861b]"
            >
              Semua Postingan →
            </Link>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {recentPosts.map((post) => (
              <div key={post.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-sm font-semibold text-zinc-900 hover:text-[#E6AF2E] dark:text-zinc-100"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-zinc-400">
                    {formatDateIndonesian(new Date(post.createdAt * 1000))} • Penulis: {post.author.name}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                  {post.status === "PUBLISHED" ? "Terbit" : post.status === "DRAFT" ? "Draf" : "Arsip"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Peluang Menjelang Tutup */}
        <div>
          <ClosingSoonList
            opportunities={closingSoonOpportunities.map((op) => ({
              id: op.id,
              title: op.title,
              organizer: op.organizer || "PERISAI UMI",
              category: op.category || "LOMBA",
              deadlineAt: op.deadlineAt ? new Date(op.deadlineAt * 1000).toISOString() : new Date().toISOString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
