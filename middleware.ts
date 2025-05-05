import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { SessionType } from "@/types";

const protectedRoutes = ["/", "/chats", "/dashboard"];
const publicRoutes = ["/auth"];

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const pathWithoutLocale = path.replace(/^\/(?:ar|en)(?:\/|$)/, "/");

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );
  console.log("isProtectedRoute", isProtectedRoute, pathWithoutLocale);

  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  const cookie = (await cookies()).get("session")?.value;
  const session: SessionType = cookie ? JSON.parse(cookie) : null;

  if (isProtectedRoute && !session?.token) {
    const locale = path.match(/^\/(ar|en)(?:\/|$)/)
      ? path.split("/")[1]
      : routing.defaultLocale;
    const authPath = `/${locale}/auth`;
    return NextResponse.redirect(new URL(authPath, req.url));
  }

  if (isPublicRoute && session?.token) {
    const locale = path.match(/^\/(ar|en)(?:\/|$)/)
      ? path.split("/")[1]
      : routing.defaultLocale;
    const homePath = `/${locale}`;
    return NextResponse.redirect(new URL(homePath, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/api/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
