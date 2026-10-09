import { z } from "zod";

export const mediaSchema = z.object({
  filename: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int(),
  url: z.string().min(1),
  path: z.string().min(1),
  driver: z.string().default("local"),
});

export type MediaInput = z.infer<typeof mediaSchema>;
