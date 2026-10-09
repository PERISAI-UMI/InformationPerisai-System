export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Jika di lokal dan secret belum diset, loloskan untuk pengujian
  if (!secretKey) {
    if (process.env.NODE_ENV !== "production") {
      return true;
    }
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
    console.error("Kesalahan validasi Turnstile:", error);
    return false;
  }
}
