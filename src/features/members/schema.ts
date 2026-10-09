import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().min(2, "Nama anggota minimal 2 karakter"),
  nim: z.string().optional().nullable(),
  faculty: z.string().optional().nullable(),
  major: z.string().optional().nullable(),
  periodId: z.string().min(1, "Periode wajib dipilih"),
  departmentId: z.string().optional().nullable(),
  roleOrTitle: z.string().min(2, "Jabatan / Amanah wajib diisi"),
  avatarUrl: z.string().optional().nullable(),
  orderIndex: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type MemberInput = z.infer<typeof memberSchema>;
