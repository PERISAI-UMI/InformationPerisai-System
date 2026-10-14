/**
 * images.ts — Image Processing (Edge-safe)
 *
 * `sharp` adalah binding native C++ Node.js yang TIDAK kompatibel dengan
 * Cloudflare Workers (V8 Isolate). Implementasi ini mendeteksi runtime:
 *
 * - DEVELOPMENT (Node.js): mencoba import `sharp` secara dinamis untuk
 *   resize + konversi ke WebP dengan kualitas optimal.
 * - PRODUCTION / EDGE (Cloudflare Workers): lewati pemrosesan sharp sepenuhnya,
 *   kembalikan buffer asli. Konversi format dilakukan oleh Cloudflare Images
 *   atau dihandle di sisi klien.
 *
 * Bundler edge tidak akan menyertakan sharp karena import berada di dalam
 * blok kondisional yang hanya dievaluasi di Node.js environment.
 */

export interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Deteksi apakah runtime saat ini adalah Cloudflare Workers / edge.
 * Di edge, kita tidak boleh mencoba import sharp.
 */
function isCloudflareEdge(): boolean {
  // Cloudflare Workers: tidak ada `process.versions.node`
  // Next.js edge runtime: process.env.NEXT_RUNTIME === 'edge'
  if (process.env.NEXT_RUNTIME === "edge") return true;
  if (process.env.NODE_ENV === "production") {
    // Di production, asumsikan edge kecuali ada bukti sebaliknya
    // (mis. FORCE_NODE_IMAGES=true untuk deployment VPS Node.js)
    return process.env.FORCE_NODE_IMAGES !== "true";
  }
  return false;
}

/**
 * Memproses gambar: resize ke maxWidth, konversi ke WebP.
 *
 * Di edge/production: mengembalikan buffer asli tanpa modifikasi.
 * Di development: menggunakan sharp jika tersedia.
 *
 * @param buffer   - Buffer gambar input
 * @param options  - Opsi resize & kualitas
 * @returns Buffer hasil pemrosesan (atau buffer asli jika di edge)
 */
export async function processImage(
  buffer: Buffer,
  options: ProcessImageOptions = {}
): Promise<Buffer> {
  // Di edge runtime, bypass sharp sepenuhnya
  if (isCloudflareEdge()) {
    return buffer;
  }

  // Di Node.js (development), coba gunakan sharp
  try {
    // Dynamic import: bundler edge tidak akan follow import ini
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default;

    return await sharp(buffer)
      .resize({
        width: options.maxWidth ?? 1920,
        height: options.maxHeight,
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: options.quality ?? 85 })
      .toBuffer();
  } catch {
    // sharp tidak tersedia (belum diinstall atau tidak kompatibel)
    // Kembalikan buffer asli sebagai fallback aman
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[images] sharp tidak tersedia. Gunakan `npm install sharp` untuk optimasi gambar di dev. " +
          "File akan diunggah tanpa kompresi."
      );
    }
    return buffer;
  }
}

/**
 * Deteksi apakah buffer berisi data gambar berdasarkan magic bytes.
 * Digunakan sebagai alternatif pengecekan MIME type dari nama file.
 */
export function isImageBuffer(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)
    return true;
  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  )
    return true;
  // GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  )
    return true;
  // WebP: RIFF????WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46
  )
    return true;
  return false;
}

/**
 * Tentukan ekstensi output yang tepat berdasarkan environment.
 * Di edge, pertahankan ekstensi asli. Di Node.js dengan sharp, gunakan .webp.
 */
export function getOutputExtension(
  originalMime: string,
  originalExt: string
): string {
  if (isCloudflareEdge()) {
    // Di edge, simpan format asli (tidak ada konversi)
    return originalExt;
  }
  // Di Node.js dengan sharp tersedia, konversi gambar ke WebP
  if (originalMime.startsWith("image/") && originalMime !== "image/svg+xml") {
    return ".webp";
  }
  return originalExt;
}

/**
 * Tentukan MIME type output yang tepat berdasarkan environment.
 */
export function getOutputMimeType(originalMime: string): string {
  if (isCloudflareEdge()) {
    return originalMime;
  }
  if (originalMime.startsWith("image/") && originalMime !== "image/svg+xml") {
    return "image/webp";
  }
  return originalMime;
}
