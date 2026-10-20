"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FinanceSummaryCards } from "./FinanceSummaryCards";
import { TransactionModal } from "./TransactionModal";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { toast } from "@/components/ui/Toast";
import { deleteTransactionAction } from "../actions";
import type {
  FinanceSummary,
  TransactionFilterParams,
  TransactionItem,
} from "../types";
import type { PaginatedResult } from "@/types";

interface FinanceManagerProps {
  summary: FinanceSummary;
  transactionsData: PaginatedResult<TransactionItem>;
  periods: Array<{ idPeriode: number; namaPeriode: string; isActive: number }>;
  filters: TransactionFilterParams;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FinanceManager({
  summary,
  transactionsData,
  periods,
  filters,
  canCreate = true,
  canUpdate = true,
  canDelete = true,
  canExport = true,
}: FinanceManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const showActionColumn = canUpdate || canDelete;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);

  // Receipt preview modal
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  // Filter form states
  const [selectedPeriode, setSelectedPeriode] = useState<string>(
    filters.periodeId ? String(filters.periodeId) : ""
  );
  const [selectedJenis, setSelectedJenis] = useState<string>(
    filters.jenisTransaksi || "semua"
  );
  const [startDate, setStartDate] = useState<string>(filters.startDate || "");
  const [endDate, setEndDate] = useState<string>(filters.endDate || "");
  const [searchQuery, setSearchQuery] = useState<string>(filters.search || "");

  const applyFilters = (overrides: Partial<TransactionFilterParams> = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    const newPeriode = overrides.periodeId !== undefined
      ? overrides.periodeId ? String(overrides.periodeId) : ""
      : selectedPeriode;
    const newJenis = overrides.jenisTransaksi !== undefined
      ? overrides.jenisTransaksi
      : selectedJenis;
    const newStart = overrides.startDate !== undefined ? overrides.startDate : startDate;
    const newEnd = overrides.endDate !== undefined ? overrides.endDate : endDate;
    const newSearch = overrides.search !== undefined ? overrides.search : searchQuery;
    const newPage = overrides.page !== undefined ? String(overrides.page) : "1";

    if (newPeriode) params.set("periodeId", newPeriode);
    else params.delete("periodeId");

    if (newJenis && newJenis !== "semua") params.set("jenisTransaksi", newJenis);
    else params.delete("jenisTransaksi");

    if (newStart) params.set("startDate", newStart);
    else params.delete("startDate");

    if (newEnd) params.set("endDate", newEnd);
    else params.delete("endDate");

    if (newSearch && newSearch.trim() !== "") params.set("search", newSearch.trim());
    else params.delete("search");

    params.set("page", newPage);

    startTransition(() => {
      router.push(`/admin/finance?${params.toString()}`);
    });
  };

  const handleResetFilters = () => {
    setSelectedPeriode("");
    setSelectedJenis("semua");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    startTransition(() => {
      router.push("/admin/finance");
    });
  };

  const handleOpenCreateModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: TransactionItem) => {
    setSelectedTransaction(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const res = await deleteTransactionAction(id);
    if (res.success) {
      toast.success("Transaksi kas berhasil dihapus.");
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast.error(res.message || "Gagal menghapus transaksi.");
    }
  };

  const handleExportCSV = () => {
    const items = transactionsData.items;
    if (items.length === 0) {
      toast.error("Tidak ada data transaksi untuk diekspor.");
      return;
    }

    const headers = [
      "No",
      "ID Transaksi",
      "Tanggal Transaksi",
      "Jenis Mutasi",
      "Kategori",
      "Nominal (Rp)",
      "Keterangan",
      "Periode",
      "Dicatat Oleh",
      "Bukti Nota (URL)",
    ];

    const rows = items.map((item, index) => [
      index + 1,
      item.idTransaksi,
      item.tanggalTransaksi,
      item.jenisTransaksi.toUpperCase(),
      `"${(item.kategori || "").replace(/"/g, '""')}"`,
      item.nominal,
      `"${(item.keterangan || "").replace(/"/g, '""')}"`,
      `"${(item.periode?.namaPeriode || "-").replace(/"/g, '""')}"`,
      `"${(item.dicatatOlehUser?.namaLengkap || item.dicatatOleh || "-").replace(/"/g, '""')}"`,
      item.buktiNota || "-",
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];

    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Keuangan_PERISAI_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Data transaksi berhasil diekspor ke format CSV.");
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <FinanceSummaryCards summary={summary} />

      {/* Action Bar & Filters Container */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a20] p-4 sm:p-5 shadow-lg space-y-4">
        {/* Top Controls: Export & Add Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Riwayat Pembukuan Kas
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
              {transactionsData.total} Data
            </span>
          </div>

          {(canExport || canCreate) && (
            <div className="flex items-center gap-2">
              {canExport && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Ekspor CSV</span>
                </Button>
              )}

              {canCreate && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleOpenCreateModal}
                  className="bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-[#1b1b1f] font-extrabold hover:brightness-110 flex items-center gap-1.5"
                >
                  <span>+</span>
                  <span>Catat Transaksi</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-white/5">
          {/* Filter Periode */}
          <div>
            <label className="text-[11px] font-medium text-zinc-400 mb-1 block">
              Periode Kepengurusan
            </label>
            <select
              value={selectedPeriode}
              onChange={(e) => {
                setSelectedPeriode(e.target.value);
                applyFilters({ periodeId: e.target.value ? Number(e.target.value) : undefined });
              }}
              className="w-full rounded-xl border border-white/10 bg-[#16161a] px-3 py-2 text-xs text-white focus:border-[#FFB22C] focus:outline-none"
            >
              <option value="">Semua Periode</option>
              {periods.map((p) => (
                <option key={p.idPeriode} value={p.idPeriode}>
                  {p.namaPeriode} {p.isActive === 1 ? "(Aktif)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Jenis Transaksi */}
          <div>
            <label className="text-[11px] font-medium text-zinc-400 mb-1 block">
              Jenis Mutasi
            </label>
            <select
              value={selectedJenis}
              onChange={(e) => {
                const val = e.target.value as "pemasukan" | "pengeluaran" | "semua";
                setSelectedJenis(val);
                applyFilters({ jenisTransaksi: val });
              }}
              className="w-full rounded-xl border border-white/10 bg-[#16161a] px-3 py-2 text-xs text-white focus:border-[#FFB22C] focus:outline-none"
            >
              <option value="semua">Semua Mutasi</option>
              <option value="pemasukan">+ Pemasukan Saja</option>
              <option value="pengeluaran">- Pengeluaran Saja</option>
            </select>
          </div>

          {/* Filter Rentang Tanggal Mulai */}
          <div>
            <label className="text-[11px] font-medium text-zinc-400 mb-1 block">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                applyFilters({ startDate: e.target.value });
              }}
              className="w-full rounded-xl border border-white/10 bg-[#16161a] px-3 py-2 text-xs text-white focus:border-[#FFB22C] focus:outline-none"
            />
          </div>

          {/* Filter Rentang Tanggal Akhir */}
          <div>
            <label className="text-[11px] font-medium text-zinc-400 mb-1 block">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                applyFilters({ endDate: e.target.value });
              }}
              className="w-full rounded-xl border border-white/10 bg-[#16161a] px-3 py-2 text-xs text-white focus:border-[#FFB22C] focus:outline-none"
            />
          </div>

          {/* Search Box */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[11px] font-medium text-zinc-400 mb-1 block">
                Cari Keterangan / Kategori
              </label>
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyFilters({ search: searchQuery });
                  }
                }}
                className="w-full rounded-xl border border-white/10 bg-[#16161a] px-3 py-2 text-xs text-white focus:border-[#FFB22C] focus:outline-none"
              />
            </div>
            {(selectedPeriode || selectedJenis !== "semua" || startDate || endDate || searchQuery) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-zinc-400 hover:text-white text-xs h-[35px]"
                title="Reset Semua Filter"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a20] overflow-hidden shadow-lg">
        {transactionsData.items.length === 0 ? (
          <div className="p-8">
            <EmptyState
              type="empty"
              title="Belum Ada Transaksi"
              description="Tidak ada catatan transaksi keuangan yang sesuai dengan kriteria filter saat ini."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#16161a]/60 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Jenis</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4 text-center">Nota</th>
                  <th className="py-3 px-4">Dicatat Oleh</th>
                  {showActionColumn && <th className="py-3 px-4 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactionsData.items.map((item) => {
                  const isPemasukan = item.jenisTransaksi === "pemasukan";

                  return (
                    <tr
                      key={item.idTransaksi}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Tanggal */}
                      <td className="py-3 px-4 text-zinc-300 whitespace-nowrap font-medium">
                        {item.tanggalTransaksi}
                      </td>

                      {/* Jenis Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isPemasukan
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                          }`}
                        >
                          {isPemasukan ? "▲ Pemasukan" : "▼ Pengeluaran"}
                        </span>
                      </td>

                      {/* Kategori */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-[11px]">
                          {item.kategori}
                        </span>
                      </td>

                      {/* Keterangan */}
                      <td className="py-3 px-4 text-white font-medium min-w-[180px] max-w-xs md:max-w-md lg:max-w-xl truncate" title={item.keterangan}>
                        {item.keterangan}
                        {item.periode && (
                          <span className="block text-[10px] text-zinc-500 font-normal">
                            Periode: {item.periode.namaPeriode}
                          </span>
                        )}
                      </td>

                      {/* Nominal */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-bold">
                        <span
                          className={
                            isPemasukan ? "text-emerald-400" : "text-rose-400"
                          }
                        >
                          {isPemasukan ? "+" : "-"}
                          {formatRupiah(item.nominal)}
                        </span>
                      </td>

                      {/* Bukti Nota */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {item.buktiNota ? (
                          <button
                            type="button"
                            onClick={() => setPreviewReceiptUrl(item.buktiNota)}
                            className="inline-flex items-center gap-1 text-[11px] text-[#FFB22C] hover:underline"
                            title="Klik untuk melihat bukti nota"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Lihat</span>
                          </button>
                        ) : (
                          <span className="text-zinc-600 text-[10px]">-</span>
                        )}
                      </td>

                      {/* Dicatat Oleh */}
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap text-[11px]">
                        {item.dicatatOlehUser?.namaLengkap || item.dicatatOleh || "-"}
                      </td>

                      {/* Aksi */}
                      {showActionColumn && (
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {canUpdate && (
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#FFB22C] bg-[#FFB22C]/10 border border-[#FFB22C]/25 hover:bg-[#FFB22C]/20 hover:border-[#FFB22C]/40 hover:text-[#FFC85A] transition-all shadow-sm shrink-0 cursor-pointer"
                                title="Ubah Transaksi Kas"
                              >
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                                <span>Ubah</span>
                              </button>
                            )}
                            {canDelete && (
                              <ConfirmDelete
                                title="Hapus Transaksi Kas"
                                description={`Apakah Anda yakin ingin menghapus catatan transaksi "${item.keterangan}" (${formatRupiah(item.nominal)})? Tindakan ini akan memperbarui saldo kas.`}
                                onConfirm={() => handleDelete(item.idTransaksi)}
                                triggerText="Hapus"
                              />
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {transactionsData.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-[#16161a]/40 text-xs">
            <span className="text-zinc-400">
              Halaman <span className="font-bold text-white">{transactionsData.page}</span> dari{" "}
              <span className="font-bold text-white">{transactionsData.totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={transactionsData.page <= 1 || isPending}
                onClick={() => applyFilters({ page: transactionsData.page - 1 })}
                className="border-white/10 text-xs py-1 px-3"
              >
                Sebelumnya
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={transactionsData.page >= transactionsData.totalPages || isPending}
                onClick={() => applyFilters({ page: transactionsData.page + 1 })}
                className="border-white/10 text-xs py-1 px-3"
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Add/Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
        periods={periods}
        onSuccess={() => {
          startTransition(() => {
            router.refresh();
          });
        }}
      />

      {/* Receipt Image Preview Modal */}
      <Dialog
        isOpen={Boolean(previewReceiptUrl)}
        onClose={() => setPreviewReceiptUrl(null)}
        title="Lampiran Bukti Nota / Kuitansi"
        className="max-w-xl"
      >
        <div className="space-y-4">
          {previewReceiptUrl && (
            <div className="relative max-h-[70vh] overflow-hidden rounded-xl border border-white/10 bg-black/40 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewReceiptUrl}
                alt="Bukti Nota"
                className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            {previewReceiptUrl && (
              <a
                href={previewReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#FFB22C] hover:underline flex items-center gap-1"
              >
                <span>Buka di Tab Baru</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewReceiptUrl(null)}
            >
              Tutup
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
