"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MediaPicker } from "@/components/common/MediaPicker";
import { useToast } from "@/components/ui/Toast";
import {
  DEFAULT_FINANCE_CATEGORIES,
  type TransactionItem,
} from "../types";
import { createTransactionAction, updateTransactionAction } from "../actions";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: TransactionItem | null;
  periods: Array<{ idPeriode: number; namaPeriode: string; isActive: number }>;
  onSuccess: () => void;
}

export function TransactionModal({
  isOpen,
  onClose,
  transaction,
  periods,
  onSuccess,
}: TransactionModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activePeriod = periods.find((p) => p.isActive === 1) || periods[0];

  const [idPeriode, setIdPeriode] = useState<number>(
    activePeriod?.idPeriode || 1
  );
  const [jenisTransaksi, setJenisTransaksi] = useState<"pemasukan" | "pengeluaran">(
    "pemasukan"
  );
  const [kategori, setKategori] = useState<string>(DEFAULT_FINANCE_CATEGORIES[0]);
  const [customKategori, setCustomKategori] = useState<string>("");
  const [nominal, setNominal] = useState<string>("");
  const [tanggalTransaksi, setTanggalTransaksi] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [keterangan, setKeterangan] = useState<string>("");
  const [buktiNota, setBuktiNota] = useState<string>("");

  useEffect(() => {
    if (transaction) {
      setIdPeriode(transaction.idPeriode);
      setJenisTransaksi(
        transaction.jenisTransaksi === "pengeluaran" ? "pengeluaran" : "pemasukan"
      );
      if (DEFAULT_FINANCE_CATEGORIES.includes(transaction.kategori)) {
        setKategori(transaction.kategori);
        setCustomKategori("");
      } else {
        setKategori("Lain-lain");
        setCustomKategori(transaction.kategori);
      }
      setNominal(String(transaction.nominal));
      setTanggalTransaksi(transaction.tanggalTransaksi);
      setKeterangan(transaction.keterangan);
      setBuktiNota(transaction.buktiNota || "");
    } else {
      setIdPeriode(activePeriod?.idPeriode || 1);
      setJenisTransaksi("pemasukan");
      setKategori(DEFAULT_FINANCE_CATEGORIES[0]);
      setCustomKategori("");
      setNominal("");
      setTanggalTransaksi(new Date().toISOString().split("T")[0]);
      setKeterangan("");
      setBuktiNota("");
    }
    setErrorMessage(null);
  }, [transaction, activePeriod, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const finalKategori = kategori === "Lain-lain" && customKategori.trim() !== ""
      ? customKategori.trim()
      : kategori;

    const numNominal = parseFloat(nominal);
    if (isNaN(numNominal) || numNominal <= 0) {
      setErrorMessage("Nominal transaksi harus berupa angka positif.");
      return;
    }

    if (!keterangan.trim()) {
      setErrorMessage("Keterangan transaksi wajib diisi.");
      return;
    }

    if (!idPeriode) {
      setErrorMessage("Periode kepengurusan wajib dipilih.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        idPeriode,
        jenisTransaksi,
        kategori: finalKategori,
        nominal: numNominal,
        tanggalTransaksi,
        keterangan: keterangan.trim(),
        buktiNota: buktiNota.trim() || null,
      };

      const result = transaction
        ? await updateTransactionAction(transaction.idTransaksi, payload)
        : await createTransactionAction(payload);

      if (!result.success) {
        setErrorMessage(result.message || "Gagal menyimpan transaksi");
        toast.error(result.message || "Gagal menyimpan transaksi");
      } else {
        toast.success(
          transaction
            ? "Transaksi berhasil diperbarui"
            : "Transaksi baru berhasil dicatat"
        );
        onSuccess();
        onClose();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? "Ubah Transaksi Kas" : "Catat Transaksi Kas Baru"}
      description="Lengkapi rincian mutasi kas masuk atau keluar untuk pembukuan UKM PERISAI UMI."
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Jenis Transaksi & Periode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
              Jenis Mutasi <span className="text-[#FFB22C]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setJenisTransaksi("pemasukan")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  jenisTransaksi === "pemasukan"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm"
                    : "bg-[#16161a] text-zinc-400 border-white/10 hover:text-white"
                }`}
              >
                + Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setJenisTransaksi("pengeluaran")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  jenisTransaksi === "pengeluaran"
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm"
                    : "bg-[#16161a] text-zinc-400 border-white/10 hover:text-white"
                }`}
              >
                - Pengeluaran
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
              Periode Kepengurusan <span className="text-[#FFB22C]">*</span>
            </label>
            <select
              value={idPeriode}
              onChange={(e) => setIdPeriode(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-[#16161a] px-3 py-2 text-xs text-white focus:border-[#FFB22C] focus:outline-none"
            >
              {periods.map((p) => (
                <option key={p.idPeriode} value={p.idPeriode}>
                  {p.namaPeriode} {p.isActive === 1 ? "(Aktif)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nominal & Tanggal Transaksi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
              Nominal (Rp) <span className="text-[#FFB22C]">*</span>
            </label>
            <Input
              type="number"
              min="1"
              step="any"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              placeholder="Contoh: 250000"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
              Tanggal Transaksi <span className="text-[#FFB22C]">*</span>
            </label>
            <Input
              type="date"
              value={tanggalTransaksi}
              onChange={(e) => setTanggalTransaksi(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Kategori */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
            Kategori Transaksi <span className="text-[#FFB22C]">*</span>
          </label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#16161a] px-3 py-2 text-xs text-white focus:border-[#FFB22C] focus:outline-none"
          >
            {DEFAULT_FINANCE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {kategori === "Lain-lain" && (
            <div className="mt-2">
              <Input
                type="text"
                value={customKategori}
                onChange={(e) => setCustomKategori(e.target.value)}
                placeholder="Sebutkan kategori kustom..."
                required
              />
            </div>
          )}
        </div>

        {/* Keterangan */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
            Keterangan / Rincian <span className="text-[#FFB22C]">*</span>
          </label>
          <Textarea
            rows={2}
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Deskripsi mutasi (contoh: Iuran kas anggota bulan Oktober)..."
            required
          />
        </div>

        {/* Bukti Nota / Lampiran */}
        <div>
          <MediaPicker
            label="Bukti Nota / Kuitansi Pembayaran (Opsional)"
            value={buktiNota}
            onChange={(url) => setBuktiNota(url)}
          />
          <p className="mt-1 text-[11px] text-zinc-500">
            Unggah foto kuitansi/struk atau masukkan link dokumen bukti.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-[#1b1b1f] font-extrabold hover:brightness-110"
          >
            {transaction ? "Perbarui Transaksi" : "Simpan Transaksi"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
