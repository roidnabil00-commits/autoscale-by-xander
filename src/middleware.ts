import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Satpam memeriksa 'saku baju' (Cookies) pengunjung
  const adminSession = request.cookies.get("xander_admin_session");

  // Jika mencoba masuk ruang Admin tapi tidak punya Cookie
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!adminSession) {
      // Usir dan arahkan ke halaman Login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Jika sudah login tapi mencoba buka halaman login lagi
  if (request.nextUrl.pathname.startsWith("/login")) {
    if (adminSession) {
      // Arahkan langsung masuk ke dasbor
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

// Konfigurasi area mana saja yang dijaga oleh Satpam ini
export const config = {
  matcher: ["/admin/:path*", "/login"],
};