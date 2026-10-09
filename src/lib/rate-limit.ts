interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  limit?: number; // Jumlah request maksimal
  windowMs?: number; // Periode jendela dalam milidetik
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { isAllowed: boolean; remaining: number; resetAt: number } {
  const limit = options.limit || 5;
  const windowMs = options.windowMs || 60 * 1000; // 1 menit default
  const now = Date.now();

  const record = memoryStore.get(identifier);

  if (!record || record.resetAt < now) {
    memoryStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { isAllowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { isAllowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { isAllowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}
