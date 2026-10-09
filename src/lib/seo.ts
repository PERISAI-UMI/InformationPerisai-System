import type { Metadata } from "next";

export interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

export function generateSeoMetadata({
  title,
  description = "Portal resmi UKM PERISAI UMI (Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia).",
  path = "",
  image = "/og-default.jpg",
}: SeoProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://perisai-umi.org";
  const url = `${baseUrl}${path}`;
  const fullTitle = title ? `${title} | UKM PERISAI UMI` : "UKM PERISAI UMI — Pusat Riset & Inovasi Mahasiswa";

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "UKM PERISAI UMI",
      images: [
        {
          url: image.startsWith("http") ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title || "UKM PERISAI UMI",
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.startsWith("http") ? image : `${baseUrl}${image}`],
    },
  };
}
