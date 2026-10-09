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
