import { NextResponse } from "next/server";

export async function POST(req)
{
  const token = req.cookies.get("token");

  if (!token)
  {
    return NextResponse.json(
      { message: "You are not logged in", success: false },
      { status: 401 }
    );
  }

  console.log("Logging out user with token:", token.value);
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

    response.cookies.set({
    name: "userId",
    value: "",
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });
  return response;
}
