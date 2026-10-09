import { isOpportunityOpen, getOpportunityStatusLabel } from "../src/features/opportunities/status";

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ PASSED: ${name}`);
  } catch (err) {
    console.error(`  ✗ FAILED: ${name}`, err);
    throw err;
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

console.log("🧪 Running opportunity status tests...");

const baseNow = new Date("2026-10-07T12:00:00Z");

runTest("Deadline di masa depan harus bernilai buka (isOpen = true)", () => {
  const futureDeadline = new Date("2026-10-15T12:00:00Z");
  assert(isOpportunityOpen(futureDeadline, baseNow) === true, "Harus berstatus buka");
  const info = getOpportunityStatusLabel(futureDeadline, baseNow);
  assert(info.label === "DIBUKA", "Label harus DIBUKA");
  assert(info.variant === "success", "Variant harus success");
});

runTest("Deadline di masa lalu harus bernilai tutup (isOpen = false)", () => {
  const pastDeadline = new Date("2026-10-01T12:00:00Z");
  assert(isOpportunityOpen(pastDeadline, baseNow) === false, "Harus berstatus tutup");
  const info = getOpportunityStatusLabel(pastDeadline, baseNow);
  assert(info.label === "DITUTUP", "Label harus DITUTUP");
  assert(info.variant === "danger", "Variant harus danger");
});

runTest("Deadline persis sama dengan waktu saat ini harus masih terbuka", () => {
  assert(isOpportunityOpen(baseNow, baseNow) === true, "Tepat pada detik deadline masih terbuka");
});

console.log("🎉 All opportunity status tests passed successfully!\n");
