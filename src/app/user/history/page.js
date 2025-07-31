"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/Components/DashboardLayout";

export default function AttendanceHistory({ role = "employee" })
{
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        async function fetchData()
        {
            setLoading(true);
            try
            {
                const res = await fetch("/api/attendancehistory", {
                    method: "POST",
                });
                const data = await res.json();
                setRecords(data);
            } catch (err)
            {
                console.error("Fetch error:", err);
            } finally
            {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <DashboardLayout role={role}>
            <div className="max-w-4xl mx-auto mt-10 p-6 border rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Attendance History</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : records.length === 0 ? (
                    <p>No attendance records found.</p>
                ) : (
                    <table className="w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                {role === "admin" && <th className="p-2 border">User ID</th>}
                                <th className="p-2 border">Date</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Check In</th>
                                <th className="p-2 border">Check Out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((rec, index) => (
                                <tr key={index} className="text-center">
                                    {role === "admin" && <td className="border p-2">{rec.userId}</td>}
                                    <td className="border p-2">{rec.date}</td>
                                    <td className="border p-2 capitalize">{rec.status}</td>
                                    <td className="border p-2">{rec.checkIn || "-"}</td>
                                    <td className="border p-2">{rec.checkOut || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}
