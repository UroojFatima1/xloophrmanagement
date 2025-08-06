import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";
import Payroll from "@/model/Payroll";
import User from "@/model/User";
import { cookies } from "next/headers";
import verifyJwtToken from "@/lib/jwt";
import jwt from "jsonwebtoken";

export async function GET(req)
{
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const secret = process.env.JWT_SECRET;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try
    {
        const decoded = jwt.verify(token, secret);
        let role = decoded.role;
        const userId = decoded.userId;

        let payrolls;
        let users = [];

        if (role === "admin")
        {
            payrolls = await Payroll.find().populate("userId", "name email");

            users = await User.find({}, "name email");
        }
        else
        {
            role = "employee";
            payrolls = await Payroll.find({ userId }).populate("userId", "name email");
        }

        return NextResponse.json(
            { payroll: payrolls, role, users },
            { status: 200 }
        );
    } catch (error)
    {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
}
