import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req)
{
    const token = req.cookies.get('token')?.value;
    const url = req.nextUrl.clone();

    if (!token)
    {
        if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/user"))
        {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
        if (req.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'admin')
        {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        if (url.pathname.startsWith("/user") && !["user", "admin"].includes(decoded.role))
        {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        return NextResponse.next();
    } catch (error)
    {
        console.error("JWT error:", error);
        return NextResponse.redirect(new URL('/', req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/user/:path*"],
};
