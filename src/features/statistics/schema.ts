import { z } from "zod";

export const statisticSchema = z.object({
  label: z.string().min(2, "Label statistik minimal 2 karakter"),
  value: z.number().int().min(0, "Nilai minimal 0"),
  suffix: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  orderIndex: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type StatisticInput = z.infer<typeof statisticSchema>;
