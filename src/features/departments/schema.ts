import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(2, "Nama departemen minimal 2 karakter"),
  slug: z.string().optional(),
  code: z.string().max(20).optional().nullable(),
  description: z.string().optional().nullable(),
  orderIndex: z.number().int().default(0),
  logoUrl: z.string().optional().nullable(),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;
