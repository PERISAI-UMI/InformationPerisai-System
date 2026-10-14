/**
 * rate-limit.ts — In-Memory Rate Limiter with Automatic Eviction (Leak-safe)
 *
 * Menerapkan sliding-window counter sederhana dengan mekanisme sweep otomatis
 * agar memoryStore tidak tumbuh tanpa batas (unbounded memory leak) akibat
 * ribuan IP/request acak yang hanya berkunjung satu kali.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();
const MAX_STORE_SIZE = 1000;
const SWEEP_THRESHOLD = 200;

/** Membersihkan entri yang sudah kadaluarsa untuk mencegah memory leak */
function sweepExpiredEntries(now: number): void {
  if (memoryStore.size < SWEEP_THRESHOLD) return;

  for (const [key, record] of memoryStore.entries()) {
    if (record.resetAt < now) {
      memoryStore.delete(key);
    }
  }

  // Jika setelah sweep masih melebihi batas aman, hapus entri paling awal (FIFO)
  if (memoryStore.size > MAX_STORE_SIZE) {
    const overflowCount = memoryStore.size - MAX_STORE_SIZE;
    const keysToDelete = Array.from(memoryStore.keys()).slice(0, overflowCount);
    for (const k of keysToDelete) {
      memoryStore.delete(k);
    }
  }
}

export interface RateLimitOptions {
  limit?: number; // Jumlah request maksimal dalam window
  windowMs?: number; // Durasi jendela waktu dalam milidetik
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { isAllowed: boolean; remaining: number; resetAt: number } {
  const limit = options.limit || 5;
  const windowMs = options.windowMs || 60 * 1000; // 1 menit default
  const now = Date.now();

  // Jalankan periodic sweep untuk menjaga ukuran memori
  sweepExpiredEntries(now);

  const record = memoryStore.get(identifier);

  if (!record || record.resetAt < now) {
    const newResetAt = now + windowMs;
    memoryStore.set(identifier, {
      count: 1,
      resetAt: newResetAt,
    });
    return { isAllowed: true, remaining: limit - 1, resetAt: newResetAt };
  }

  if (record.count >= limit) {
    return { isAllowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { isAllowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}
