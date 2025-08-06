import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";
import { Attendance } from "@/model/Attendance";

export async function POST(request)
{
  try
  {
    const body = await request.json();
    const { userId, date, status, checkIn, checkOut } = body;

    if (!userId || !date || !status)
    {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();


    const existing = await Attendance.findOne({ userId, date });
    if (existing)
    {
      return NextResponse.json({ error: "Attendance already marked for today" }, { status: 400 });
    }
    console.log("Marking attendance for user:", userId, "on date:", date, checkIn, checkOut);
    const newRecord = await Attendance.create({
      userId,
      date: new Date(date),
      status,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut)
    });

    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
  } catch (error)
  {
    console.error("Attendance Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
