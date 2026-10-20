import {
  hashPassword,
  verifyPassword,
  isLegacyPasswordHash,
} from "../src/lib/auth";
import { verifyTurnstileToken } from "../src/lib/turnstile";

function runTest(name: string, fn: () => void | Promise<void>): Promise<void> {
  return Promise.resolve()
    .then(() => fn())
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
  console.log("🧪 Running Auth Re-hash & Turnstile security tests...");

  // 1. Uji deteksi legacy SHA-256 hash
  await runTest("isLegacyPasswordHash mendeteksi hash SHA-256 64-karakter dengan benar", () => {
    // SHA-256 hash untuk 'perisai2026'
    const legacySha256 = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3";
    assert(isLegacyPasswordHash(legacySha256) === true, "Harus mengidentifikasi SHA-256 sebagai legacy hash");

    const scryptHash = "1a2b3c4d5e6f:abcdef0123456789";
    assert(isLegacyPasswordHash(scryptHash) === false, "scrypt hash tidak boleh dianggap sebagai legacy hash");

    assert(isLegacyPasswordHash("") === false, "String kosong bukan legacy hash");
    assert(isLegacyPasswordHash("short") === false, "String pendek bukan legacy hash");
  });

  // 2. Uji verifikasi legacy SHA-256
  await runTest("verifyPassword dapat memverifikasi kata sandi legacy SHA-256", async () => {
    const rawPassword = "perisai2026";
    const legacySha256 = "4283b39888d7d101c980f6a155b8ce46377d5d9ecf23089bbc659d3e302bf5d7";

    const isMatch = await verifyPassword(rawPassword, legacySha256);
    assert(isMatch === true, "Kata sandi yang cocok dengan hash SHA-256 harus lolos");

    const isWrong = await verifyPassword("wrongpassword", legacySha256);
    assert(isWrong === false, "Kata sandi yang salah harus ditolak");
  });


  // 3. Uji hashing scrypt baru dan verifikasinya
  await runTest("hashPassword menghasilkan format scrypt yang valid dan dapat diverifikasi", async () => {
    const rawPassword = "rahasiaUKMPerisai2026!";
    const newScryptHash = await hashPassword(rawPassword);

    assert(typeof newScryptHash === "string", "Hash scrypt harus berupa string");
    assert(newScryptHash.includes(":"), "Hash scrypt harus memiliki pemisah colon (salt:hexKey)");

    const parts = newScryptHash.split(":");
    assert(parts.length === 2, "Hash scrypt harus terdiri dari 2 bagian");
    assert(parts[0].length === 32, "Salt harus 16 bytes (32 hex characters)");
    assert(parts[1].length === 128, "Derived key harus 64 bytes (128 hex characters)");

    assert(isLegacyPasswordHash(newScryptHash) === false, "Hash baru tidak boleh terdeteksi sebagai legacy hash");

    const isMatch = await verifyPassword(rawPassword, newScryptHash);
    assert(isMatch === true, "verifyPassword harus memvalidasi kata sandi terhadap hash scrypt baru");

    const isWrong = await verifyPassword("salahKataSandi", newScryptHash);
    assert(isWrong === false, "verifyPassword harus menolak kata sandi yang salah terhadap hash scrypt");
  });

  // 4. Uji Turnstile tanpa secret key (graceful bypass agar admin tidak terkunci jika belum diset)
  await runTest("verifyTurnstileToken melewatkan verifikasi jika secret key kosong", async () => {
    const prevSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    const prevOldSecret = process.env.TURNSTILE_SECRET_KEY;

    try {
      delete process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
      delete process.env.TURNSTILE_SECRET_KEY;

      const res = await verifyTurnstileToken("");
      assert(res === true, "Harus mengembalikan true jika secret key tidak dikonfigurasi (graceful bypass)");
    } finally {
      if (prevSecret) process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = prevSecret;
      if (prevOldSecret) process.env.TURNSTILE_SECRET_KEY = prevOldSecret;
    }
  });

  // 5. Uji Turnstile token bypass ketika widget belum aktif di client
  await runTest("verifyTurnstileToken menerima token bypass client 'turnstile-not-configured'", async () => {
    const prevSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    try {
      process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = "dummy-secret-key";

      const resBypass = await verifyTurnstileToken("turnstile-not-configured");
      assert(resBypass === true, "Token 'turnstile-not-configured' harus di-bypass");

      const resDevBypass = await verifyTurnstileToken("dev-bypass-turnstile-token");
      assert(resDevBypass === true, "Token 'dev-bypass-turnstile-token' harus di-bypass");
    } finally {
      if (prevSecret) {
        process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = prevSecret;
      } else {
        delete process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
      }
    }
  });


  // 6. Uji Turnstile jika secret key ada namun token kosong
  await runTest("verifyTurnstileToken menolak token kosong meskipun secret key diset", async () => {
    const prevSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    try {
      process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = "dummy-secret-key";

      const resEmpty = await verifyTurnstileToken("");
      assert(resEmpty === false, "Token kosong harus ditolak");

      const resWhitespace = await verifyTurnstileToken("   ");
      assert(resWhitespace === false, "Token whitespace harus ditolak");
    } finally {
      if (prevSecret) {
        process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = prevSecret;
      } else {
        delete process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
      }
    }
  });

  console.log("🎉 All Auth Re-hash & Turnstile tests passed successfully!\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
