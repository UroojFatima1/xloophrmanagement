"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/app/Components/DashboardLayout";

export default function PayrollPage()
{
    const [formError, setFormError] = useState("");
    const [role, setUserRole] = useState(null);
    const [payrollData, setPayrollData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [employees, setEmployees] = useState([]);

    useEffect(() =>
    {
        const fetchPayroll = async () =>
        {
            try
            {
                const res = await fetch("/api/payroll", {
                    headers: {
                        Authorization: `Bearer ${document.cookie
                            .split("; ")
                            .find((row) => row.startsWith("token="))
                            ?.split("=")[1]
                            }`,
                    },
                });

                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to fetch payroll");

                setPayrollData(data.payroll);
                setUserRole(data.role);
                if (data.role === "admin")
                {
                    setEmployees(data.users || []);
                }
            } catch (err)
            {
                setError(err.message);
            } finally
            {
                setLoading(false);
            }
        };

        fetchPayroll();
    }, []);

    return loading || !role ? (
        <div className="text-center mt-10 text-gray-600">Loading payroll data...</div>
    ) : (
        <DashboardLayout role={role}>
            <div className="max-w-6xl mx-auto mt-10 p-6 border rounded shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Payroll</h2>
                    {role === "admin" && (
                        <button
                            onClick={() =>
                            {
                                setFormError("");
                                setEditData(null);
                                setShowForm(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Add Payroll
                        </button>
                    )}
                </div>

                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : payrollData.length === 0 ? (
                    <p className="text-gray-500">No payroll record found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Pay Period</th>
                                    <th className="border p-2">Basic Salary</th>
                                    <th className="border p-2">Allowances</th>
                                    <th className="border p-2">Deductions</th>
                                    <th className="border p-2">Net Salary</th>
                                    {role === "admin" && <th className="border p-2">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {payrollData.map((entry) => (
                                    <tr key={entry._id}>
                                        <td className="border p-2">{entry.userId?.name || "N/A"}</td>
                                        <td className="border p-2">
                                            {new Date(entry.payPeriod).toLocaleDateString("en-US", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="border p-2">Rs. {entry.basicSalary}</td>
                                        <td className="border p-2">Rs. {entry.allowances}</td>
                                        <td className="border p-2">Rs. {entry.deductions}</td>
                                        <td className="border p-2 font-semibold">Rs. {entry.netSalary}</td>

                                        {role === "admin" && (
                                            <td className="border p-2">
                                                <button
                                                    className="text-blue-500 underline"
                                                    onClick={() =>
                                                    {
                                                        setEditData(entry);
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
                            <h3 className="text-lg font-bold mb-4">
                                {editData ? "Edit Payroll" : "Add Payroll"}
                            </h3>

                            <form
                                onSubmit={async (e) =>
                                {
                                    e.preventDefault();
                                    setFormError("");
                                    const form = e.target;
                                    const payload = {
                                        userId: editData?.userId?._id || form.userId.value,
                                        payPeriod: new Date(form.payPeriod.value),
                                        basicSalary: parseFloat(form.basicSalary.value),
                                        allowances: parseFloat(form.allowances.value),
                                        deductions: parseFloat(form.deductions.value),
                                    };
                                    payload.netSalary =
                                        payload.basicSalary + payload.allowances - payload.deductions;


                                    const res = await fetch("/api/addpayroll", {
                                        method: editData ? "PUT" : "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(
                                            editData ? { ...payload, _id: editData._id } : payload
                                        ),
                                    });

                                    const payroll = await res.json();

                                    if (!res.ok)
                                    {
                                        setFormError(payroll.error || "Something went wrong. Please try again.");
                                        return;
                                    }

                                    setShowForm(false);
                                    window.location.reload();


                                }}
                            >
                                {editData ? (
                                    <>
                                        <div className="mb-3">
                                            <label className="block">Name:</label>
                                            <input
                                                disabled
                                                value={editData.userId?.name || ""}
                                                className="border w-full px-2 py-1 rounded bg-gray-100"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block">Email:</label>
                                            <input
                                                disabled
                                                value={editData.userId?.email || ""}
                                                className="border w-full px-2 py-1 rounded bg-gray-100"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="mb-3">
                                        <label className="block">Select Employee:</label>
                                        <select
                                            name="userId"
                                            className="border w-full px-2 py-1 rounded"
                                            required
                                        >
                                            <option value="">-- Select --</option>
                                            {employees.map((emp) => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.name} ({emp.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="block">Pay Period:</label>
                                    <input
                                        type="month"
                                        name="payPeriod"
                                        defaultValue={
                                            editData?.payPeriod
                                                ? new Date(editData.payPeriod).toISOString().slice(0, 7)
                                                : ""
                                        }
                                        required
                                        className="border w-full px-2 py-1 rounded"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block">Basic Salary:</label>
                                    <input
                                        type="number"
                                        name="basicSalary"
                                        defaultValue={editData?.basicSalary || ""}
                                        required
                                        className="border w-full px-2 py-1 rounded"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block">Allowances:</label>
                                    <input
                                        type="number"
                                        name="allowances"
                                        defaultValue={editData?.allowances || 0}
                                        className="border w-full px-2 py-1 rounded"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block">Deductions:</label>
                                    <input
                                        type="number"
                                        name="deductions"
                                        defaultValue={editData?.deductions || 0}
                                        className="border w-full px-2 py-1 rounded"
                                    />
                                </div>
                                {formError && (
                                    <p className="text-red-500 text-sm mb-3">{formError}</p>
                                )}

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-1 bg-gray-300 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1 bg-blue-600 text-white rounded"
                                    >
                                        {editData ? "Update" : "Add"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
