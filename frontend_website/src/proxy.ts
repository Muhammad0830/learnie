import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

const nextIntlMiddleware = createMiddleware(routing);
const defaultLocale = routing.defaultLocale;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}/dashboard`, request.url)
    );
  }

  return nextIntlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)"
  ],
};
