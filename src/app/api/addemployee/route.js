import { connectDB } from "@/lib/dbconnect";
import User from "@/model/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request)
{
    try
    {
        await connectDB();
        const { name, email, position, salary, password } = await request.json();
        const existingUser = await User.findOne({ email });
        console.log("Fetched employee:", existingUser);
        if (existingUser)
        {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            position,
            salary,
            password,
            role: "user",
        });
        console.log("Created employee:", user);
        return NextResponse.json({ message: "Employee added successfully", user });
    } catch (error)
    {
        console.error("GET /api/employees error:", error);
        return Response.json({ error: "Failed to fetch employees" }, { status: 500 });
    }
}


