import { cookies } from "next/headers";
import  verifyJwtToken  from "@/lib/jwt";
import Attendance from "@/model/Attendance";
import { connectDB } from "@/lib/dbconnect";

export async function POST()
{
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const user = verifyJwtToken(token);

    if (!user)
    {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    let records = [];

    if (user.role === "admin")
    {
        records = await Attendance.find({}).sort({ date: -1 });
    } else
    {
        records = await Attendance.find({ userId: user.id }).sort({ date: -1 });
    }

    return new Response(JSON.stringify(records), { status: 200 });
}
