import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

type UserRole = "Customer" | "SupportAgent" | "Developer" | "Admin";

interface JWTPayload {
  id: string;
  role: UserRole;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);

    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const user = await verifyToken(token);

  // Invalid or expired token
  if (!user || !user.id || !user.role) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const pathname = request.nextUrl.pathname;

  if (pathname === "/dashboard/create-ticket") {
    if (user.role !== "Customer") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  if (pathname === "/dashboard/report") {
    if (user.role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname === "/dashboard/sla") {
    if (
      user.role !== "Admin" &&
      user.role !== "SupportAgent" &&
      user.role !== "Developer"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
