export interface FinanceSummary {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoAkhir: number;
  totalTransaksi: number;
}

export interface TransactionItem {
  idTransaksi: number;
  idPeriode: number;
  jenisTransaksi: string;
  kategori: string;
  nominal: number;
  keterangan: string;
  tanggalTransaksi: string;
  buktiNota: string | null;
  dicatatOleh: string | null;
  createdAt: number;
  updatedAt: number;
  periode?: {
    idPeriode: number;
    namaPeriode: string;
  };
  dicatatOlehUser?: {
    idPerisai: string;
    namaLengkap: string;
  } | null;
}

export interface TransactionFilterParams {
  periodeId?: number;
  jenisTransaksi?: "pemasukan" | "pengeluaran" | "semua";
  kategori?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const DEFAULT_FINANCE_CATEGORIES = [
  "Kas Bulanan Anggota",
  "Dana Hibah Universitas",
  "Sponsorship & Kemitraan",
  "Pengadaan Alat & Inventaris",
  "Konsumsi & Logistik",
  "Pencetakan & ATK",
  "Operasional & Transportasi",
  "Registrasi Delegasi Lomba",
  "Lain-lain",
];
