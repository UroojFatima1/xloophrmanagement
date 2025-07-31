import { connectDB } from "@/lib/dbconnect";
import User from "@/model/User";

export async function GET()
{
    try
    {
        await connectDB();
        const employees = await User.find({ role: "user" });
        console.log("Fetched employees:", employees);
        return Response.json(employees);
    } catch (error)
    {
        console.error("GET /api/employees error:", error);
        return Response.json({ error: "Failed to fetch employees" }, { status: 500 });
    }
}
