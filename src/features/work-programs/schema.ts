import { z } from "zod";

export const workProgramSchema = z.object({
  name: z.string().min(3, "Nama proker minimal 3 karakter"),
  slug: z.string().optional(),
  departmentId: z.string().min(1, "Departemen wajib dipilih"),
  periodId: z.string().min(1, "Periode wajib dipilih"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  objectives: z.string().optional(),
  targetDate: z.string().optional().nullable(),
  status: z.enum(["PLANNED", "ONGOING", "COMPLETED", "CANCELLED"]).default("PLANNED"),
  coverImageUrl: z.string().optional().nullable(),
});

export type WorkProgramInput = z.infer<typeof workProgramSchema>;
