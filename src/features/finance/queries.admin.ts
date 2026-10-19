import prisma from "@/lib/db";
import type { PaginatedResult } from "@/types";

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

export async function getFinanceSummary(periodeId?: number): Promise<FinanceSummary> {
  const whereClause: Record<string, unknown> = {};
  if (periodeId) {
    whereClause.idPeriode = periodeId;
  }

  const [pemasukanAgg, pengeluaranAgg, totalCount] = await Promise.all([
    prisma.tKeuangan.aggregate({
      _sum: { nominal: true },
      where: { ...whereClause, jenisTransaksi: "pemasukan" },
    }),
    prisma.tKeuangan.aggregate({
      _sum: { nominal: true },
      where: { ...whereClause, jenisTransaksi: "pengeluaran" },
    }),
    prisma.tKeuangan.count({
      where: whereClause,
    }),
  ]);

  const totalPemasukan = pemasukanAgg._sum.nominal || 0;
  const totalPengeluaran = pengeluaranAgg._sum.nominal || 0;
  const saldoAkhir = totalPemasukan - totalPengeluaran;

  return {
    totalPemasukan,
    totalPengeluaran,
    saldoAkhir,
    totalTransaksi: totalCount,
  };
}

export async function getTransactions(
  params: TransactionFilterParams = {}
): Promise<PaginatedResult<TransactionItem>> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 15));
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};

  if (params.periodeId) {
    where.idPeriode = params.periodeId;
  }

  if (params.jenisTransaksi && params.jenisTransaksi !== "semua") {
    where.jenisTransaksi = params.jenisTransaksi;
  }

  if (params.kategori && params.kategori !== "semua") {
    where.kategori = params.kategori;
  }

  if (params.startDate || params.endDate) {
    where.tanggalTransaksi = {};
    if (params.startDate) {
      (where.tanggalTransaksi as Record<string, string>).gte = params.startDate;
    }
    if (params.endDate) {
      (where.tanggalTransaksi as Record<string, string>).lte = params.endDate;
    }
  }

  if (params.search && params.search.trim() !== "") {
    const q = params.search.trim();
    where.OR = [
      { keterangan: { contains: q } },
      { kategori: { contains: q } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.tKeuangan.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [
        { tanggalTransaksi: "desc" },
        { idTransaksi: "desc" },
      ],
      include: {
        periode: {
          select: {
            idPeriode: true,
            namaPeriode: true,
          },
        },
        dicatatOlehUser: {
          select: {
            idPerisai: true,
            namaLengkap: true,
          },
        },
      },
    }),
    prisma.tKeuangan.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getAllPeriods() {
  return prisma.mPeriode.findMany({
    orderBy: [
      { isActive: "desc" },
      { idPeriode: "desc" },
    ],
    select: {
      idPeriode: true,
      namaPeriode: true,
      isActive: true,
    },
  });
}
