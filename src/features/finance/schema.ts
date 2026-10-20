import { z } from "zod";

export const transactionSchema = z.object({
  idPeriode: z.coerce.number().int().positive("Periode kepengurusan wajib dipilih"),
  jenisTransaksi: z.enum(["pemasukan", "pengeluaran"], {
    message: "Jenis transaksi harus berupa pemasukan atau pengeluaran",
  }),
  kategori: z.string().min(2, "Kategori transaksi minimal 2 karakter"),
  nominal: z.coerce.number().positive("Nominal harus berupa angka lebih besar dari 0"),
  keterangan: z.string().min(3, "Keterangan transaksi minimal 3 karakter"),
  tanggalTransaksi: z.string().min(1, "Tanggal transaksi wajib diisi"),
  buktiNota: z.string().optional().nullable(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
