import { PostForm } from "@/features/posts/components/PostForm";

export default function AdminNewPostPage() {
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
