import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
