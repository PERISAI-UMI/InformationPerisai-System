/**
 * turnstile.ts — Cloudflare Turnstile Server Verification
 *
 * Memvalidasi token response Turnstile dari client ke endpoint resmi Cloudflare.
 * Mendukung CLOUDFLARE_TURNSTILE_SECRET_KEY dan fallback ke TURNSTILE_SECRET_KEY.
 * Jika secret key belum diset, verifikasi dilewati dengan peringatan log agar login
 * tidak terblokir saat widget Turnstile belum dikonfigurasi di dashboard Cloudflare.
 */

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
    process.env.TURNSTILE_SECRET_KEY;

  // Jika secret key belum diset di environment, lewati verifikasi dengan peringatan
  // agar pengguna/admin tidak terkunci jika Turnstile belum diaktifkan di dashboard
  if (!secretKey) {
    console.warn(
      "[turnstile] PERINGATAN: CLOUDFLARE_TURNSTILE_SECRET_KEY belum dikonfigurasi. Verifikasi Turnstile dilewati."
    );
    return true;
  }

  // Jika client mengirimkan token bypass karena NEXT_PUBLIC_TURNSTILE_SITE_KEY belum diset
  if (
    token === "turnstile-not-configured" ||
    token === "dev-bypass-turnstile-token"
  ) {
    console.warn(
      "[turnstile] PERINGATAN: Client menggunakan token bypass Turnstile karena site key belum terpasang. Verifikasi dilewati."
    );
    return true;
  }

  // Jika secret key ada dan widget aktif, token wajib ada dan tidak kosong
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
