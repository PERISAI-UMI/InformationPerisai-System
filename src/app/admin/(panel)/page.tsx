import { getDashboardOverview } from "@/features/dashboard/queries.admin";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { ClosingSoonList } from "@/features/dashboard/components/ClosingSoonList";
import Link from "next/link";
import { formatDateIndonesian } from "@/lib/dates";

export default async function AdminDashboardPage() {
  const { stats, closingSoonOpportunities, recentPosts } = await getDashboardOverview();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FFB22C] shadow-[0_0_8px_#FFB22C]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFB22C]">
              Pusat Kontrol Sistem
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Dasbor Pengurus
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-light">
            Selamat datang kembali di panel administrasi UKM PERISAI Universitas Muslim Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-300">
            <svg className="h-4 w-4 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span suppressHydrationWarning>{formatDateIndonesian(new Date())}</span>
          </div>
        </div>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Postingan"
          value={stats.totalPosts}
          iconType="posts"
          description="Artikel & rilis berita"
        />
        <StatCard
          title="Program Kerja"
          value={stats.totalWorkPrograms}
          iconType="programs"
          description="Seluruh proker terdaftar"
        />
        <StatCard
          title="Peluang Lomba"
          value={stats.totalOpportunities}
          iconType="opportunities"
          description="Lomba & beasiswa aktif"
        />
        <StatCard
          title="Pesan Masuk"
          value={stats.unreadMessages}
          iconType="inbox"
          description="Pesan belum dibaca"
        />
      </div>

      {/* Content Grid: Recent Posts & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Kolom Kiri: Postingan Terbaru */}
        <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#202026] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFB22C]" />
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                Postingan Berita Terkini
              </h3>
            </div>
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-[#FFB22C] hover:text-[#FFC85A] transition flex items-center gap-1"
            >
              <span>Semua Postingan</span>
              <span>→</span>
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {recentPosts.length === 0 ? (
              <p className="py-6 text-xs text-zinc-500 text-center">Belum ada postingan terbaru.</p>
            ) : (
              recentPosts.map((post) => (
                <div key={post.id} className="py-3.5 flex items-center justify-between gap-4 group">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-xs sm:text-sm font-bold text-white hover:text-[#FFB22C] line-clamp-1 transition-colors"
                    >
                      {post.title}
                    </Link>
                    <p className="text-[11px] text-zinc-400 mt-0.5 truncate font-light">
                      {formatDateIndonesian(new Date(post.createdAt * 1000))} • Oleh:{" "}
                      <strong className="text-zinc-300 font-medium">{post.author.name}</strong>
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border ${
                      post.status === "PUBLISHED"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : post.status === "DRAFT"
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                        : "bg-white/10 border-white/20 text-zinc-200"
                    }`}
                  >
                    {post.status === "PUBLISHED" ? "Terbit" : post.status === "DRAFT" ? "Draf" : "Arsip"}
                  </span>
                </div>
              ))
            )}
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
