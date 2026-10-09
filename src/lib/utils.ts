export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function truncate(text: string, length = 120): string {
  if (!text || text.length <= length) return text;
  return text.slice(0, length) + "...";
}
