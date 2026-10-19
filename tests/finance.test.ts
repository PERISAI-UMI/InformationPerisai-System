import { transactionSchema } from "../src/features/finance/schema";
import { can } from "../src/lib/permissions";
import {
  getFinanceSummary,
  getTransactions,
  getAllPeriods,
} from "../src/features/finance/queries.admin";
import type { AuthUser } from "../src/types";

function runTest(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      console.log(`  ✓ PASSED: ${name}`);
    })
    .catch((err) => {
      console.error(`  ✗ FAILED: ${name}`, err);
      throw err;
    });
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

async function main() {
  console.log("🧪 Running finance module tests...");

  // 1. Zod Validation Tests
  await runTest("transactionSchema memvalidasi input transaksi yang valid", () => {
    const validData = {
      idPeriode: 1,
      jenisTransaksi: "pemasukan",
      kategori: "Kas Bulanan Anggota",
      nominal: 150000,
      keterangan: "Iuran kas anggota Oktober",
      tanggalTransaksi: "2026-10-20",
      buktiNota: "https://r2.perisai.org/nota.jpg",
    };
    const res = transactionSchema.safeParse(validData);
    assert(res.success === true, "Valid data harus lolos parsing schema");
  });

  await runTest("transactionSchema menolak nominal <= 0 dan jenis transaksi invalid", () => {
    const invalidNominal = {
      idPeriode: 1,
      jenisTransaksi: "pemasukan",
      kategori: "Kas Bulanan",
      nominal: -5000,
      keterangan: "Uji nominal negatif",
      tanggalTransaksi: "2026-10-20",
    };
    const res1 = transactionSchema.safeParse(invalidNominal);
    assert(res1.success === false, "Nominal negatif harus ditolak");

    const invalidJenis = {
      idPeriode: 1,
      jenisTransaksi: "investasi",
      kategori: "Kas Bulanan",
      nominal: 50000,
      keterangan: "Uji jenis salah",
      tanggalTransaksi: "2026-10-20",
    };
    const res2 = transactionSchema.safeParse(invalidJenis);
    assert(res2.success === false, "Jenis transaksi tidak valid harus ditolak");
  });

  // 2. RBAC Permissions Tests
  await runTest("Otorisasi RBAC finance: EDITOR ditolak, ADMIN dan SUPER_ADMIN diizinkan", () => {
    const editor: AuthUser = {
      id: "usr_editor",
      name: "Editor Konten",
      email: "editor@perisai.org",
      role: "EDITOR",
      isActive: true,
    };
    assert(can(editor, "manage", "finance") === false, "Editor tidak boleh manage finance");
    assert(can(editor, "read", "finance") === false, "Editor tidak boleh read finance");

    const admin: AuthUser = {
      id: "usr_admin",
      name: "Admin Pengurus",
      email: "admin@perisai.org",
      role: "ADMIN",
      isActive: true,
    };
    assert(can(admin, "manage", "finance") === true, "Admin berhak manage finance");
    assert(can(admin, "read", "finance") === true, "Admin berhak read finance");

    const superAdmin: AuthUser = {
      id: "usr_sa",
      name: "Super Admin",
      email: "sa@perisai.org",
      role: "SUPER_ADMIN",
      isActive: true,
    };
    assert(can(superAdmin, "manage", "finance") === true, "Super Admin berhak manage finance");
    assert(can(null, "manage", "finance") === false, "Anonim ditolak");
  });

  // 3. Database Queries Tests
  await runTest("getFinanceSummary dan getTransactions mengembalikan struktur data yang benar", async () => {
    const summary = await getFinanceSummary();
    assert(typeof summary.totalPemasukan === "number", "totalPemasukan harus berupa number");
    assert(typeof summary.totalPengeluaran === "number", "totalPengeluaran harus berupa number");
    assert(typeof summary.saldoAkhir === "number", "saldoAkhir harus berupa number");
    assert(summary.saldoAkhir === summary.totalPemasukan - summary.totalPengeluaran, "saldoAkhir harus selisih pemasukan dan pengeluaran");

    const periods = await getAllPeriods();
    assert(Array.isArray(periods), "getAllPeriods harus mengembalikan array");

    const transactions = await getTransactions({ pageSize: 5 });
    assert(Array.isArray(transactions.items), "transactions.items harus berupa array");
    assert(typeof transactions.total === "number", "transactions.total harus berupa number");
  });

  console.log("🎉 All finance tests passed successfully!\n");
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
