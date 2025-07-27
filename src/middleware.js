import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req)
{
  const token = req.cookies.get("token")?.value;
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
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log("token: " + token);
    // 🔐 Role-based access control
    if (url.pathname.startsWith("/admin") && payload.role !== "admin")
    {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (url.pathname.startsWith("/user") && !["user", "admin"].includes(payload.role))
    {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (err)
  {
    console.error("JWT Verify Error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};