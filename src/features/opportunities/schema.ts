import { z } from "zod";

export const opportunitySchema = z.object({
  title: z.string().min(3, "Judul peluang minimal 3 karakter"),
  slug: z.string().optional(),
  organizer: z.string().min(2, "Penyelenggara wajib diisi"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  requirements: z.string().optional(),
  linkUrl: z.string().url("URL tautan tidak valid").or(z.literal("")).optional(),
  deadlineAt: z.string().min(1, "Batas waktu (deadline) wajib diisi"),
  category: z.enum(["LOMBA", "BEASISWA", "SEMINAR", "MAGANG"]).default("LOMBA"),
  coverImageUrl: z.string().optional().nullable(),
});

export type OpportunityInput = z.infer<typeof opportunitySchema>;
