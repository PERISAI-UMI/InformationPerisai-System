import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "media.perisai-umi.org",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/about",
        destination: "/tentang",
      },
      {
        source: "/about/:path*",
        destination: "/tentang/:path*",
      },
      {
        source: "/activity",
        destination: "/kabar",
      },
      {
        source: "/activity/:path*",
        destination: "/kabar/:path*",
      },
      {
        source: "/competition",
        destination: "/peluang",
      },
      {
        source: "/competition/:path*",
        destination: "/peluang/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/departemen",
        destination: "/tentang/sumber-daya#departemen",
        permanent: false,
      },
      {
        source: "/program",
        destination: "/tentang/sumber-daya#proker",
        permanent: false,
      },
      {
        source: "/galeri",
        destination: "/tentang/sumber-daya#galeri",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*(maskot|logoperisaii|logoperisaidengantulisan|og-default).(png|webp|jpg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
