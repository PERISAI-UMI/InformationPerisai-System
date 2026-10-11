import { notFound } from "next/navigation";
import { getAdminPostById } from "@/features/posts/queries.admin";
import { PostForm } from "@/features/posts/components/PostForm";

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getAdminPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Ubah Postingan
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Perbarui rincian, status publikasi, atau isi konten berita.
        </p>
      </div>

      <PostForm
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          coverImageUrl: post.coverMediaId,
          status: (["DRAFT", "PUBLISHED", "ARCHIVED"].includes(post.status.toUpperCase())
            ? (post.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED")
            : "DRAFT"),
        }}
      />
    </div>
  );
}
