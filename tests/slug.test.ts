import { slugify } from "../src/lib/slug";

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

console.log("🧪 Running slug tests...");

runTest("Konversi judul biasa ke slug ramah URL", () => {
  const result = slugify("Pekan Ilmiah Mahasiswa Nasional");
  assert(result === "pekan-ilmiah-mahasiswa-nasional", `Hasil: ${result}`);
});

runTest("Membersihkan karakter spesial dan tanda baca", () => {
  const result = slugify("Juara 1 Lomba Karya Tulis Ilmiah! (Tingkat Nasional) #2026");
  assert(result === "juara-1-lomba-karya-tulis-ilmiah-tingkat-nasional-2026", `Hasil: ${result}`);
});

runTest("Menangani spasi ganda dan tanda strip beruntun", () => {
  const result = slugify("   Riset & Inovasi   -- Mahasiswa UMI   ");
  assert(result === "riset-inovasi-mahasiswa-umi", `Hasil: ${result}`);
});

console.log("🎉 All slug tests passed successfully!\n");
