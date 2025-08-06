"use client";
import DashboardLayout from "@/app/Components/DashboardLayout";
import { useState, useEffect } from "react";

export default function MarkAttendancePage()
{
  const [status, setStatus] = useState("present");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() =>
  {
    const getCookie = (name) =>
    {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      if (match) return match[2];
      return null;
    };

    const storedId = getCookie("userId");
    if (storedId)
    {
      setUserId(storedId);
    }
  }, []);

  if (!userId)
  {
    return (
      <DashboardLayout role="employee">
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="text-red-600">You must be logged in to mark attendance.</p>
        </div>
      </DashboardLayout>
    );
  }

  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    setMessage("");

    if (checkIn && checkOut && checkOut <= checkIn)
    {
      setMessage("Check-out time must be greater than check-in time.");
      return;
    }

    setLoading(true);

    try
    {
      const todayDate = new Date(); // current date time
      const checkInDate = checkIn ? new Date(`${today}T${checkIn}:00`) : null;
      const checkOutDate = checkOut ? new Date(`${today}T${checkOut}:00`) : null;

      const res = await fetch("/api/markattendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          date: todayDate,
          status,
          checkIn: checkInDate,
          checkOut: checkOutDate,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to mark attendance");

      setMessage("Attendance marked successfully!");
    } catch (err)
    {
      setMessage(err.message);
    } finally
    {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="employee">
      <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Date</label>
            <input
              type="text"
              value={today}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Check-in Time</label>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Check-out Time</label>
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Mark Attendance"}
          </button>

          {message && (
            <p
              className={`mt-4 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"
                }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}
