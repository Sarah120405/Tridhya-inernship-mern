import { NextResponse } from "next/server";

export function middleware(request) {
  const adminKey = request.nextUrl.searchParams.get("key");

  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
