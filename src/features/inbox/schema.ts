import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Alamat email tidak valid"),
  subject: z.string().min(3, "Subjek minimal 3 karakter"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
  turnstileToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
