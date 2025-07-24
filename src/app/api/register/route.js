import {connectDB} from "@/lib/dbconnect";
import {NextResponse} from "next/server";
import User from "@/models/User";

export async function POST(request) {
    try {
        await connectDB();
        const {name, email, password} = await request.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }       }
        catch (error) {
            console.error("Registration error:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }}