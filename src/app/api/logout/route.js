import { NextResponse } from "next/server";

export async function POST(req) {
  const token = req.cookies.get("token");

  // If there's no token, return a 401 response
  if (!token) {
    return NextResponse.json(
      { message: "You are not logged in", success: false },
      { status: 401 }
    );
  }

  // Clear the token cookie
  const response = NextResponse.json({
    message: "Logout successful",
    success: true,
  });

  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}
