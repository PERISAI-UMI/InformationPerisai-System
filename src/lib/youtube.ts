/**
 * Utility helper untuk parsing dan normalisasi URL / kode embed YouTube
 * Mendukung berbagai format:
 * - https://youtu.be/JWg_p9PfnTg?si=FB3QBPygFSYXwseP
 * - https://www.youtube.com/watch?v=JWg_p9PfnTg
 * - https://www.youtube.com/embed/JWg_p9PfnTg?si=87vTr-0un14kRxu6
 * - https://www.youtube.com/shorts/JWg_p9PfnTg
 * - <iframe ... src="https://www.youtube.com/embed/JWg_p9PfnTg..." ...></iframe>
 * - Raw video ID (11 karakter)
 */

export const DEFAULT_YOUTUBE_VIDEO_ID = "JWg_p9PfnTg";

export function extractYouTubeId(urlOrCode: string | null | undefined): string | null {
  if (!urlOrCode) return null;
  const str = urlOrCode.trim();

  // 1. Jika kode iframe HTML, ekstrak atribut src terlebih dahulu
  const iframeSrcMatch = str.match(/src=["']([^"']+)["']/i);
  const target = iframeSrcMatch ? iframeSrcMatch[1] : str;

  // 2. Format pendek youtu.be/<id>
  const shortMatch = target.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortMatch) return shortMatch[1];

  // 3. Format embed youtube.com/embed/<id>
  const embedMatch = target.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch) return embedMatch[1];

  // 4. Format standar youtube.com/watch?v=<id>
  const watchMatch = target.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch) return watchMatch[1];

  // 5. Format YouTube Shorts youtube.com/shorts/<id>
  const shortsMatch = target.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch) return shortsMatch[1];

  // 6. Jika pengguna hanya memasukkan 11 digit ID video YouTube
  if (/^[a-zA-Z0-9_-]{11}$/.test(target)) return target;

  return null;
}

export function toYouTubeEmbedUrl(
  urlOrCode: string | null | undefined,
  fallbackId: string = DEFAULT_YOUTUBE_VIDEO_ID
): string {
  const id = extractYouTubeId(urlOrCode) || fallbackId;
  return `https://www.youtube.com/embed/${id}`;
}

export function toYouTubeWatchUrl(
  urlOrCode: string | null | undefined,
  fallbackId: string = DEFAULT_YOUTUBE_VIDEO_ID
): string {
  const id = extractYouTubeId(urlOrCode) || fallbackId;
  return `https://www.youtube.com/watch?v=${id}`;
}
