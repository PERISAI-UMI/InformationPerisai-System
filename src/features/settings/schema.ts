import { z } from "zod";

export const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  isPublic: z.boolean().default(false),
  description: z.string().optional().nullable(),
});

export type SettingInput = z.infer<typeof settingSchema>;
