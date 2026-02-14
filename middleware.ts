import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // Protected routes
    const protectedPaths = ["/dashboard", "/project"];
    const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    if (isProtected && !isLoggedIn) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // If logged in and on landing page, redirect to dashboard
    if (pathname === "/" && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
