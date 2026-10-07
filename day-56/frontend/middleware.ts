import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "Customer" | "SupportAgent" | "Developer" | "Admin";

async function getUserFromBackend(request: NextRequest) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });
    console.log("Cookie header in middleware:", request.headers.get("cookie"));
    console.log("Response from backend:", res);
    if (!res.ok) return null;

    const json = await res.json();
    return json.data as { id: string; role: UserRole };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const user = await getUserFromBackend(request);

  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const pathname = request.nextUrl.pathname;

  if (pathname === "/dashboard/create-ticket" && user.role !== "Customer") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/dashboard/report" && user.role !== "Admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    pathname === "/dashboard/sla" &&
    !["Admin", "SupportAgent", "Developer"].includes(user.role)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
