export interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function processImage(
  buffer: Buffer,
  options: ProcessImageOptions = {}
): Promise<Buffer> {
  // Jika sharp tersedia di runtime, gunakan sharp untuk kompresi/optimasi
  try {
    const sharp = (await import("sharp")).default;
    return await sharp(buffer)
      .resize({
        width: options.maxWidth || 1920,
        height: options.maxHeight,
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: options.quality || 85 })
      .toBuffer();
  } catch {
    // Fallback jika lib sharp belum terinstal
    return buffer;
  }
}
