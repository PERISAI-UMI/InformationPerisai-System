import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Alamat email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]).default("EDITOR"),
  isActive: z.boolean().default(true),
});

export type UserInput = z.infer<typeof userSchema>;
