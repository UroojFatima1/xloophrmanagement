import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";
import Payroll from "@/model/Payroll";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export async function POST(req)
{
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const secret = process.env.JWT_SECRET;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try
    {
        jwt.verify(token, secret);
        const body = await req.json();

        const {
            userId,
            payPeriod,
            basicSalary,
            allowances = 0,
            deductions = 0
        } = body;

        const payDate = new Date(payPeriod);
        const month = payDate.getMonth();
        const year = payDate.getFullYear();


        const existing = await Payroll.findOne({
            userId,
            $expr: {
                $and: [
                    { $eq: [{ $month: "$payPeriod" }, month + 1] },
                    { $eq: [{ $year: "$payPeriod" }, year] }
                ]
            }
        });

        if (existing)
        {
            return NextResponse.json({ error: "Payroll for this month already exists." }, { status: 400 });
        }

        const netSalary = basicSalary + allowances - deductions;

        const newPayroll = await Payroll.create({
            userId,
            payPeriod: payDate,
            basicSalary,
            allowances,
            deductions,
            netSalary
        });

        return NextResponse.json(newPayroll, { status: 201 });
    } catch (error)
    {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



export async function PUT(req)
{
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const secret = process.env.JWT_SECRET;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try
    {
        jwt.verify(token, secret);
        const body = await req.json();

        const {
            _id,
            userId,
            payPeriod: payPeriod,
            basicSalary,
            allowances = 0,
            deductions = 0
        } = body;

        const netSalary = basicSalary + allowances - deductions;

        const uppayPeriodd = await Payroll.findByIdAndUpdate(_id, {
            userId,
            payPeriod: new Date(payPeriod),
            basicSalary,
            allowances,
            deductions,
            netSalary
        }, { new: true });

        return NextResponse.json(uppayPeriodd, { status: 200 });
    } catch (error)
    {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
