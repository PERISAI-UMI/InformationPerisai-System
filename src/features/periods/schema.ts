import { z } from "zod";

export const periodSchema = z.object({
  name: z.string().min(4, "Nama periode minimal 4 karakter (contoh: 2024/2025)"),
  isActive: z.boolean().default(false),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().optional().nullable(),
  vision: z.string().optional().nullable(),
  mission: z.string().optional().nullable(),
});

export type PeriodInput = z.infer<typeof periodSchema>;
