/**
 * turnstile.ts — Cloudflare Turnstile Server Verification
 *
 * Memvalidasi token response Turnstile dari client ke endpoint resmi Cloudflare.
 * Mendukung CLOUDFLARE_TURNSTILE_SECRET_KEY dan fallback ke TURNSTILE_SECRET_KEY.
 * Di lingkungan non-produksi jika secret key tidak diset, verifikasi dilewati dengan warning log.
 * Di lingkungan produksi, verifikasi wajib lolos.
 */

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
    process.env.TURNSTILE_SECRET_KEY;

  // Jika di lingkungan selain produksi dan secret belum diset, lewati verifikasi dengan peringatan
  if (!secretKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[turnstile] PERINGATAN: CLOUDFLARE_TURNSTILE_SECRET_KEY tidak diset pada lingkungan non-produksi. Verifikasi Turnstile dilewati."
      );
      return true;
    }
    console.error(
      "[turnstile] KESALAHAN: CLOUDFLARE_TURNSTILE_SECRET_KEY wajib diset pada lingkungan produksi. Verifikasi Turnstile ditolak."
    );
    return false;
  }

  // Jika secret key ada (atau di production), token wajib ada dan tidak kosong
  if (!token || typeof token !== "string" || token.trim() === "") {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const outcome = await res.json();
    return outcome.success === true;
  } catch (error) {
    console.error("[turnstile] Kesalahan validasi Turnstile:", error);
    return false;
  }
}

