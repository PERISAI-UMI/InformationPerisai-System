export const legacyRedirectMap: Record<string, string> = {
  "/news": "/kabar",
  "/berita": "/kabar",
  "/competitions": "/peluang",
  "/lomba": "/peluang",
  "/about": "/tentang",
  "/about-us": "/tentang",
  "/profil": "/tentang",
  "/contact": "/kontak",
  "/hubungi-kami": "/kontak",
  "/departments": "/tentang/sumber-daya#departemen",
  "/departemen": "/tentang/sumber-daya#departemen",
  "/work-programs": "/tentang/sumber-daya#proker",
  "/program": "/tentang/sumber-daya#proker",
  "/proker": "/tentang/sumber-daya#proker",
  "/gallery": "/tentang/sumber-daya#galeri",
  "/galeri": "/tentang/sumber-daya#galeri",
  "/foto": "/tentang/sumber-daya#galeri",
};

export function getLegacyRedirect(pathname: string): string | null {
  if (legacyRedirectMap[pathname]) {
    return legacyRedirectMap[pathname];
  }

  // Handle nested patterns like /news/xyz -> /kabar/xyz
  if (pathname.startsWith("/news/")) {
    return pathname.replace("/news/", "/kabar/");
  }
  if (pathname.startsWith("/berita/")) {
    return pathname.replace("/berita/", "/kabar/");
  }
  if (pathname.startsWith("/competitions/")) {
    return pathname.replace("/competitions/", "/peluang/");
  }
  if (pathname.startsWith("/lomba/")) {
    return pathname.replace("/lomba/", "/peluang/");
  }
  if (pathname.startsWith("/departments/") || pathname.startsWith("/departemen/")) {
    return "/tentang/sumber-daya#departemen";
  }
  if (pathname.startsWith("/work-programs/") || pathname.startsWith("/program/")) {
    return "/tentang/sumber-daya#proker";
  }

  return null;
}
