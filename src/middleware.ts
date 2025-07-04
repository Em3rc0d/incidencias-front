import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return NextResponse.next();
  }
  // // Redirige a su panel si está en la raíz
  // if (pathname === "/") {
  //   if (role === "admin")
  //     return NextResponse.redirect(new URL("/admin", request.url));
  //   if (role === "user")
  //     return NextResponse.redirect(new URL("/user", request.url));
  // }

  // Bloquea acceso no autorizado a /admin/*
  if (
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/incidence/admin")) &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/not-authorized", request.url));
  }

  // // Bloquea acceso no autorizado a /user/*
  // if (pathname.startsWith("/user") && role !== "user") {
  //   return NextResponse.redirect(new URL("/not-authorized", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/incidence/admin/:path*"],
};
