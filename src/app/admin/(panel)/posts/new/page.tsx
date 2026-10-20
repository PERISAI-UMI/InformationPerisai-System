import { PostForm } from "@/features/posts/components/PostForm";
import { requirePermission } from "@/lib/permissions.server";

export default async function AdminNewPostPage() {
  await requirePermission("posts:create");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Buat Postingan Baru
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Tulis artikel atau berita kegiatan baru untuk dipublikasikan ke portal.
        </p>
      </div>

      <PostForm />
    </div>
  );
}
