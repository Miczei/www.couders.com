import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

// Pick the best locale from the Accept-Language header, falling back to default.
function negotiateLocale(req: NextRequest): string {
  const header = req.headers.get("accept-language");
  if (!header) return defaultLocale;
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase().split("-")[0]);
  for (const code of preferred) {
    if ((locales as readonly string[]).includes(code)) return code;
  }
  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  // Redirect any non-prefixed path (including "/") to a locale-prefixed URL.
  const locale = negotiateLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, and any file with an extension (assets).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
