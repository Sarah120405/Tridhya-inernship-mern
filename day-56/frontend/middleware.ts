import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

type UserRole = "Customer" | "SupportAgent" | "Developer" | "Admin";

/* async function getUserFromBackend(request: NextRequest) {
  try {
    const res = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as { id: string; role: UserRole };
  } catch {
    return null;
  }
} */

export async function middleware(request: NextRequest) {
  /* const user = await getUserFromBackend(request);

  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  } */

  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/", request.url));

  let role: string;
  try {
    const { payload } = await jwtVerify(token, secret);
    role = payload.role as string;
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const pathname = request.nextUrl.pathname;

  if (pathname === "/dashboard/create-ticket" && role !== "Customer") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/dashboard/report" && role !== "Admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    pathname === "/dashboard/sla" &&
    !["Admin", "SupportAgent", "Developer"].includes(role)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
