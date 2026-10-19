import React from "react";
import type { FinanceSummary } from "../queries.admin";

interface FinanceSummaryCardsProps {
  summary: FinanceSummary;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FinanceSummaryCards({ summary }: FinanceSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Saldo Kas */}
      <div className="relative overflow-hidden rounded-2xl border border-[#FFB22C]/30 bg-gradient-to-br from-[#1e1c18] to-[#16161a] p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFB22C]">
            Saldo Kas Organisasi
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFB22C]/15 text-[#FFB22C] border border-[#FFB22C]/25">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {formatRupiah(summary.saldoAkhir)}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            {summary.totalTransaksi} total mutasi tercatat
          </p>
        </div>
      </div>

      {/* Total Pemasukan */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a20] p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Total Pemasukan
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            +{formatRupiah(summary.totalPemasukan)}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            Pemasukan kumulatif periode ini
          </p>
        </div>
      </div>

      {/* Total Pengeluaran */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a20] p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Total Pengeluaran
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
            -{formatRupiah(summary.totalPengeluaran)}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            Biaya operasional & program kerja
          </p>
        </div>
      </div>
    </div>
  );
}
