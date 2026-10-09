import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLegacyRedirect } from "./lib/legacy-redirects";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Periksa pengalihan URL warisan (Legacy Redirects)
  const legacyTarget = getLegacyRedirect(pathname);
  if (legacyTarget) {
    return NextResponse.redirect(new URL(legacyTarget, request.url), 301);
  }

  // 2. Pemeriksaan awal rute /admin (Guard Kasar)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("perisai_session_id")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua path kecuali:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.svg, og-default.jpg, file publik lainnya
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.svg|og-default.jpg|uploads).*)",
  ],
};
