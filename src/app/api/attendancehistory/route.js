import User from "@/model/User";
import Attendance from "@/model/Attendance";
import { connectDB } from "@/lib/dbconnect";
import { cookies } from "next/headers";
import verifyJwtToken from "@/lib/jwt";

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
        const allUsers = await User.find({}, "_id email");
        const userMap = new Map(allUsers.map(u => [u._id.toString(), u.email]));

        const rawRecords = await Attendance.find({}).sort({ date: -1 });

        records = rawRecords
            .filter(rec => userMap.has(rec.userId.toString()))
            .map(rec => ({
                ...rec.toObject(),
                email: userMap.get(rec.userId.toString())
            }));
    }
    else
    {
        user.role = "employee";
        console.log("Attendance records fetched:", user.userId);
        records = await Attendance.find({ userId: user.userId }).sort({ date: -1 });

        records = records.map(rec => ({
            ...rec.toObject(),
            email: user.email
        }));
    }
    console.log("Attendance records fetched:", records);
    return new Response(
        JSON.stringify({ records, role: user.role }),
        { status: 200 }
    );
}
