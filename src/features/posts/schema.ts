import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(200, "Judul maksimal 200 karakter"),
  slug: z.string().optional(),
  content: z.string().min(10, "Konten berita minimal 10 karakter"),
  excerpt: z.string().max(300, "Ringkasan maksimal 300 karakter").optional(),
  coverImageUrl: z.string().url("URL gambar tidak valid").or(z.string().startsWith("/")).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type PostInput = z.infer<typeof postSchema>;
