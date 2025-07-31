import { NextResponse } from "next/server";
import Employee from "@/model/User";
import { connectDB } from "@/lib/dbconnect";

export async function DELETE(req, { params }) 
{
    const { id } = await params;
    await connectDB();

    try
    {
        const deletedEmp = await Employee.findByIdAndDelete(id);
        if (!deletedEmp)
        {
            return NextResponse.json({ error: "Employee not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Employee deleted" });
    } catch (err)
    {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}


export async function PUT(req, { params })
{
    await connectDB();
    const { id } = await params;
    const { name, email, position, salary } = await req.json();

    try
    {
        const updatedEmp = await Employee.findByIdAndUpdate(
            id,
            { name, email, position, salary },
            { new: true }
        );

        if (!updatedEmp)
        {
            return NextResponse.json({ error: "Employee not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Employee updated", user: updatedEmp });
    }
    catch (err)
    {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}