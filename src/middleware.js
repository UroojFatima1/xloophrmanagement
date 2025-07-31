import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req)
{
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  if (!token)
  {
    // Redirect unauthenticated users from protected paths
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
    const role = payload.role;

    // 🔐 Role-based routing
    if (url.pathname.startsWith("/admin"))
    {
      if (role !== "admin")
      {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    else if (url.pathname.startsWith("/user/employee"))
    {
      if (role !== "user")
      {
        // Admins not allowed in /user/employee
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    else if (url.pathname.startsWith("/user"))
    {
      if (!["admin", "uuser"].includes(role))
      {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  }
  catch (err)
  {
    console.error("JWT Verify Error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
