import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UKM PERISAI UMI — Pusat Riset & Inovasi Mahasiswa",
    template: "%s | UKM PERISAI UMI",
  },
  description:
    "Portal resmi UKM PERISAI UMI (Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia). Wadah penelitian, penalaran ilmiah, dan prestasi mahasiswa UMI Makassar.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://perisai-umi.org"),
  openGraph: {
    title: "UKM PERISAI UMI — Pusat Riset & Inovasi Mahasiswa",
    description:
      "Wadah penelitian, karya tulis ilmiah, dan inovasi teknologi mahasiswa Universitas Muslim Indonesia.",
    images: ["/og-default.jpg"],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/logoperisaii.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/logoperisaii.png",
    apple: "/logoperisaii.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        {children}
      </body>
    </html>
  );
}
