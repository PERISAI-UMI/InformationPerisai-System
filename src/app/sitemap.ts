import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://perisai-umi.org";
  const now = new Date();

  const staticRoutes = [
    "",
    "/tentang",
    "/tentang/sumber-daya",
    "/activity",
    "/competition",
    "/kontak",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
