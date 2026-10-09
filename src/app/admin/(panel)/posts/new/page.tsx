import { PostForm } from "@/features/posts/components/PostForm";

export default function AdminNewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Buat Postingan Baru
        </h1>
        <p className="text-sm text-zinc-500">
          Tulis artikel atau berita kegiatan baru untuk dipublikasikan ke portal.
        </p>
      </div>

      <PostForm />
    </div>
  );
}
