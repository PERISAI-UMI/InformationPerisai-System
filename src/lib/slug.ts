import prisma from "@/lib/db";

/**
 * Mengubah string teks menjadi slug yang ramah URL (lowercase, strip, bebas karakter khusus).
 */
export function slugify(text: string): string {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // Pisahkan diakritik
    .replace(/[\u0300-\u036f]/g, "") // Hapus diakritik
    .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter non-alfanumerik kecuali spasi dan strip
    .replace(/[\s_]+/g, "-") // Ganti spasi dan underscore dengan strip
    .replace(/-+/g, "-") // Ganti beberapa strip berturut-turut menjadi satu strip
    .replace(/^-+|-+$/g, ""); // Pangkas strip di awal dan akhir
}

export type SlugSupportedModel =
  | "tBerita"
  | "tKompetisi"
  | "tProker"
  | "mDepartemen";

/**
 * Menghasilkan slug unik untuk model database yang ditentukan.
 * Jika terdapat duplikasi / collision akibat postingan dengan judul sama,
 * fungsi ini menambahkan suffix numerik/acak secara aman untuk mencegah DB constraint violation.
 *
 * @param model       - Nama model Prisma (tBerita | tKompetisi | tProker | mDepartemen)
 * @param text        - Teks dasar (judul artikel, nama proker, nama departemen)
 * @param excludeId   - ID numerik entitas saat ini jika sedang melakukan UPDATE (agar tidak conflict dengan dirinya sendiri)
 */
export async function generateUniqueSlug(
  model: SlugSupportedModel,
  text: string,
  excludeId?: number
): Promise<string> {
  const baseSlug = slugify(text) || "konten";
  let candidate = baseSlug;

  const idFieldMap: Record<SlugSupportedModel, string> = {
    tBerita: "idBerita",
    tKompetisi: "idKompetisi",
    tProker: "idProker",
    mDepartemen: "idDepartemen",
  };
  const idField = idFieldMap[model] || "id";

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const delegate = (prisma as any)[model];
    if (!delegate || typeof delegate.findFirst !== "function") {
      return `${baseSlug}-${Date.now().toString(36).slice(-4)}`;
    }

    const existing = await delegate.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { [idField]: { not: excludeId } } : {}),
      },
      select: { slug: true },
    });

    if (!existing) {
      return candidate;
    }

    // Jika terjadi collision (judul kembar), tambahkan short random suffix
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    candidate = `${baseSlug}-${randomSuffix}`;

    const secondCheck = await delegate.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { [idField]: { not: excludeId } } : {}),
      },
      select: { slug: true },
    });

    if (secondCheck) {
      // Fallback timestamp untuk collision ganda ekstrim
      return `${baseSlug}-${Date.now().toString(36)}`;
    }

    return candidate;
  } catch {
    // Fallback aman jika query lookup mengalami gangguan
    return `${baseSlug}-${Date.now().toString(36).slice(-4)}`;
  }
}
