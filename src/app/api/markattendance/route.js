import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbconnect";
import Attendance from "@/model/Attendance";

export async function POST(request)
{
  try
  {
    const body = await request.json();
    const { userId, date, status } = body;

    if (!userId || !date || !status)
    {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();


    const existing = await Attendance.findOne({ userId, date });
    if (existing)
    {
      return NextResponse.json({ error: "Attendance already marked for today" }, { status: 400 });
    }

    const newRecord = await Attendance.create({
      userId,
      date,
      status,
    });

    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
  } catch (error)
  {
    console.error("Attendance Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
