/**
 * Safely parse any date input (Date instance, Unix timestamp in seconds or ms, ISO string, or number)
 */
export function parseDate(dateInput: unknown): Date | null {
  if (!dateInput) return null;

  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }

  if (typeof dateInput === "number") {
    // If timestamp is in seconds (10 digits, e.g. 1729450000), convert to ms
    const ms = dateInput < 10000000000 ? dateInput * 1000 : dateInput;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof dateInput === "string") {
    const trimmed = dateInput.trim();
    if (!trimmed) return null;

    // Check if it's purely digits (unix timestamp as string)
    if (/^\d+$/.test(trimmed)) {
      const num = Number(trimmed);
      const ms = num < 10000000000 ? num * 1000 : num;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }

    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

export function formatDateIndonesian(dateInput: unknown): string {
  const date = parseDate(dateInput);
  if (!date) return "-";

  try {
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Makassar",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "-";
  }
}

export function formatDateTimeWITA(dateInput: unknown): string {
  const date = parseDate(dateInput);
  if (!date) return "-";

  try {
    const formattedDate = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Makassar",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

    return `${formattedDate} WITA`;
  } catch {
    return "-";
  }
}

export function isFutureDate(dateInput: unknown): boolean {
  const date = parseDate(dateInput);
  if (!date) return false;
  return date.getTime() >= Date.now();
}

export function getDaysRemaining(dateInput: unknown): number {
  const date = parseDate(dateInput);
  if (!date) return 0;
  const diffTime = date.getTime() - Date.now();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
