import { requirePermission } from "@/lib/permissions.server";
import {
  getFinanceSummary,
  getTransactions,
  getAllPeriods,
  type TransactionFilterParams,
} from "@/features/finance/queries.admin";
import { FinanceManager } from "@/features/finance/components/FinanceManager";

export const dynamic = "force-dynamic";

interface AdminFinancePageProps {
  searchParams: Promise<{
    periodeId?: string;
    jenisTransaksi?: string;
    kategori?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
  }>;
}

export default async function AdminFinancePage({ searchParams }: AdminFinancePageProps) {
  const session = await requirePermission("finance:read");

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const periodeId = resolvedParams.periodeId
    ? parseInt(resolvedParams.periodeId, 10)
    : undefined;
  const jenisTransaksi = (resolvedParams.jenisTransaksi as
    | "pemasukan"
    | "pengeluaran"
    | "semua") || "semua";
  const kategori = resolvedParams.kategori;
  const search = resolvedParams.search;
  const startDate = resolvedParams.startDate;
  const endDate = resolvedParams.endDate;

  const filters: TransactionFilterParams = {
    periodeId,
    jenisTransaksi,
    kategori,
    search,
    startDate,
    endDate,
    page,
    pageSize: 15,
  };

  const [summary, transactionsData, periods] = await Promise.all([
    getFinanceSummary(periodeId),
    getTransactions(filters),
    getAllPeriods(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manajemen Keuangan Kas
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Pencatatan pembukuan, arus kas masuk & keluar, dan laporan pertanggungjawaban (LPJ) UKM PERISAI UMI.
          </p>
        </div>
      </div>

      <FinanceManager
        summary={summary}
        transactionsData={transactionsData}
        periods={periods}
        filters={filters}
      />
    </div>
  );
}
