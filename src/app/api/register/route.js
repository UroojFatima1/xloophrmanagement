import { connectDB } from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request)
{
    try
    {
        await connectDB();

        const { name, email, password } = await request.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
        {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const role = email === "admin@example.com" ? "admin" : "user";

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        return NextResponse.json({ message: "User registered", user });
    } catch (error)
    {
        console.log("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
