import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";
import jwt from "jsonwebtoken";
import { User } from "./types/types";

const nextIntlMiddleware = createMiddleware(routing);
const defaultLocale = routing.defaultLocale;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("refreshToken");

  if (!token || !token.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = jwt.verify(token.value, process.env.JWT_SECRET!) as User;

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}/dashboard`, request.url)
    );
  }

  const checkPathName = () => {
    if (
      (pathname.startsWith("/en/students/create") && user.role !== "admin") ||
      (pathname.includes("/edit") &&
        pathname.includes("/students") &&
        user.role !== "admin") ||
      (pathname.startsWith("/en/teachers/create") && user.role !== "admin") ||
      (pathname.includes("/edit") &&
        pathname.includes("/teachers") &&
        user.role !== "admin") ||
      (pathname.startsWith("/en/courses/create/courses") &&
        user.role !== "admin") ||
      (pathname.includes("/edit") &&
        pathname.includes("/courses") &&
        user.role !== "admin") ||
      (pathname.startsWith("/en/courses/create/topics") &&
        user.role !== "admin") ||
      (pathname.startsWith("/en/students") && user.role === "student") ||
      (pathname.startsWith("/en/teachers") && user.role === "student")
    )
      return true;
    else return false;
  };

  if (checkPathName()) {
    return NextResponse.redirect(new URL(`/${defaultLocale}/403`, request.url));
  }

  return nextIntlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
