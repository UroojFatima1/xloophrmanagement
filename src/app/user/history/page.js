"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/Components/DashboardLayout";

export default function AttendanceHistory()
{
    const [records, setRecords] = useState([]);
    const [role, setRole] = useState("");
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

                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                setRecords(data.records);
                setRole(data.role);
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


    const groupedRecords = records.reduce((acc, rec) =>
    {
        if (!acc[rec.email]) acc[rec.email] = [];
        acc[rec.email].push(rec);
        return acc;
    }, {});

    return (
        <DashboardLayout role={role}>
            <div className="max-w-5xl mx-auto mt-10 p-6 border rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Attendance History</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : records.length === 0 ? (
                    <p>No attendance records found.</p>
                ) : role === "admin" ? (
                    // Admin view
                    Object.entries(groupedRecords).map(([email, userRecords]) => (
                        <div key={email} className="mb-8">
                            <h3 className="text-lg font-bold mb-2 text-blue-600">{email}</h3>
                            <table className="w-full border mb-4">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Date</th>
                                        <th className="p-2 border">Status</th>
                                        <th className="p-2 border">Check In</th>
                                        <th className="p-2 border">Check Out</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userRecords.map((rec, index) => (
                                        <tr key={index} className="text-center">
                                            <td className="border p-2">
                                                {new Date(rec.date).toLocaleDateString()}
                                            </td>
                                            <td className="border p-2 capitalize">{rec.status}</td>
                                            <td className="border p-2">
                                                {rec.checkIn
                                                    ? new Date(rec.checkIn).toLocaleTimeString()
                                                    : "-"}
                                            </td>
                                            <td className="border p-2">
                                                {rec.checkOut
                                                    ? new Date(rec.checkOut).toLocaleTimeString()
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (

                    <table className="w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Date</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Check In</th>
                                <th className="p-2 border">Check Out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((rec, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">
                                        {new Date(rec.date).toLocaleDateString()}
                                    </td>
                                    <td className="border p-2 capitalize">{rec.status}</td>
                                    <td className="border p-2">
                                        {rec.checkIn
                                            ? new Date(rec.checkIn).toLocaleTimeString()
                                            : "-"}
                                    </td>
                                    <td className="border p-2">
                                        {rec.checkOut
                                            ? new Date(rec.checkOut).toLocaleTimeString()
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}
