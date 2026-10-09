/**
 * Menghitung status buka/tutup peluang (kompetisi, beasiswa, dsb)
 * berdasarkan tanggal tenggat (deadline_at) dan waktu saat ini.
 */
export function isOpportunityOpen(
  deadlineAt?: Date | string | null,
  referenceTime: Date = new Date()
): boolean {
  if (!deadlineAt) return true; // Deadline kosong berarti selalu buka sampai diarsipkan
  const deadline = typeof deadlineAt === "string" ? new Date(deadlineAt) : deadlineAt;
  if (isNaN(deadline.getTime())) {
    return false;
  }
  return deadline.getTime() >= referenceTime.getTime();
}

export function getOpportunityStatusLabel(
  deadlineAt?: Date | string | null,
  referenceTime: Date = new Date()
): { isOpen: boolean; label: "DIBUKA" | "DITUTUP"; variant: "success" | "danger" } {
  const open = isOpportunityOpen(deadlineAt, referenceTime);
  return {
    isOpen: open,
    label: open ? "DIBUKA" : "DITUTUP",
    variant: open ? "success" : "danger",
  };
}
