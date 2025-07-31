import { connectDB } from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import User from "@/model/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req)
{
    await connectDB();
    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (!user)
        return Response.json(
            { message: "User Not Found!", success: false },
            { status: 401 }
        );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return Response.json(
            { message: "Invalid Password", success: false },
            { status: 401}
        );

    const token = jwt.sign(
        { userId: user._id, role: user.role, email: user.email, },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    const response = NextResponse.json({
        message: "Login successful",
        success: true,
        role: user.role,
    });

    response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        maxAge: 60 * 60, // 1 hour
        path: "/",
    });
      response.cookies.set("userId", user._id.toString(), {
        httpOnly: false,
        maxAge: 60 * 60,
        path: "/",
    });

    return response;

}