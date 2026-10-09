export function formatDateIndonesian(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateTimeWITA(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "-";

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${formattedDate} WITA`;
}

export function isFutureDate(dateInput: Date | string): boolean {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.getTime() >= Date.now();
}

export function getDaysRemaining(dateInput: Date | string): number {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const diffTime = date.getTime() - Date.now();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
