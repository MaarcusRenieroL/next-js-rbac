import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;
    // relative path

    // Manage route protection
    const token = await getToken({ req });
    const isAuth = !!token;
    const isUser = req.nextUrl.pathname.startsWith("/user");
    const isAdmin = req.nextUrl.pathname.startsWith("/admin");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    const unprotectedRoutes = ["/login", "/register"];
    if (!isAuth && !unprotectedRoutes.includes(pathname) && !isApiRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (isUser && token?.role !== "USER") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (isAdmin && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/app/:path*",
    "/login",
    "/admin",
    "/user",
    "/register",
    "/api/:path*",
  ],
};