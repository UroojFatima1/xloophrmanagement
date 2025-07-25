import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
    const token = req.cookies.get('token')?.value;
    const url = req.nextUrl.clone();

    if (url.pathname === "/unauthorized") {
        return NextResponse.next();
    }

    if (!token) {
        if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/user")) {
            console.log("No token, redirecting to /");
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
        return NextResponse.next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (url.pathname.startsWith("/admin") && decoded.role !== "admin") {
            console.log("Unauthorized admin access");
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (url.pathname.startsWith("/user") && !["user", "admin"].includes(decoded.role)) {
            console.log("Unauthorized user access");
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("JWT Error:", error);
        return NextResponse.redirect(new URL("/", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/user/:path*"],
};
