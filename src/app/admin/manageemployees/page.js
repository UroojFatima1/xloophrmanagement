"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrash, FaPen } from "react-icons/fa";
import DashboardLayout from "@/app/Components/DashboardLayout";


export default function ManageEmployees()
{
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [message, setmessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        position: "",
        salary: "",
    });


    const resetForm = () =>
    {
        setForm({ name: '', email: '', password: '', position: '', salary: '' });
    };


    const handleChange = (e) =>
        setForm({ ...formData, [e.target.name]: e.target.value });

    useEffect(() =>
    {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () =>
    {
        try
        {
            const res = await fetch("/api/employees");
            if (!res.ok) throw new Error("Failed to fetch employees");
            const data = await res.json();
            setEmployees(data);
        } catch (error)
        {
            console.error("Error fetching employees:", error);
        } finally
        {
            setLoading(false);
        }
    };

    const handleDelete = async (id) =>
    {
        if (!confirm("Are you sure you want to delete this employee?")) return;

        try
        {
            const res = await fetch(`/api/employees/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete employee");

            setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        } catch (error)
        {
            console.error("Error deleting employee:", error);
        }
    };

    const handleAddEmployee = async (e) =>
    {
        e.preventDefault();

        try
        {
            const res = await fetch("/api/addemployee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await res.json();

            if (!res.ok)
            {
                setmessage(result.error || "Failed to add employee");
                return;
            }

            setmessage(result.message || "Employee added successfully");
            setEmployees([...employees, result.user]);
            setForm({ name: "", email: "", password: "", position: "", salary: "" });
            setShowModal(false);

        } catch (error)
        {
            console.error("Error adding employee:", error);
            setmessage("Something went wrong. Please try again.");
        }
    };


    const filteredEmployees = employees.filter((emp) =>
        (emp?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (emp?.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (emp?.position ?? "").toLowerCase().includes(search.toLowerCase())
    );


    return (
        <DashboardLayout role="admin">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold">Manage Employees</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add Employee
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                <input
                    type="text"
                    placeholder="Search employee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2"
                />
                <p className="text-sm text-gray-600">
                    Total Employees: <span className="font-semibold">{filteredEmployees.length}</span>
                </p>
            </div>

            {loading ? (
                <p>Loading employees...</p>
            ) : filteredEmployees.length === 0 ? (
                <p>No employees found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="py-3 px-5 text-left">Name</th>
                                <th className="py-3 px-5 text-left">Email</th>
                                <th className="py-3 px-5 text-left">Position</th>
                                <th className="py-3 px-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp) => (
                                <tr key={emp._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-5">{emp.name}</td>
                                    <td className="py-3 px-5">{emp.email}</td>
                                    <td className="py-3 px-5">{emp.position}</td>
                                    <td className="py-3 px-5 text-center">
                                        <div className="flex justify-center gap-4 text-lg">
                                            <Link href={`/employees/edit/${emp._id}`}>
                                                <button className="text-yellow-600 hover:text-yellow-800">
                                                    <FaPen />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(emp._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
                        <form onSubmit={handleAddEmployee} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full border border-gray-300 p-2 rounded"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full border border-gray-300 p-2 rounded"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full border border-gray-300 p-2 rounded"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Position"
                                className="w-full border border-gray-300 p-2 rounded"
                                value={form.position}
                                onChange={(e) => setForm({ ...form, position: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Salary"
                                className="w-full border border-gray-300 p-2 rounded"
                                value={form.salary}
                                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                            />

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"

                                >
                                    Save
                                </button>
                            </div>
                            {message && (
                                <>
                                    <hr className={`my-2 border-t-2 ${message.includes("success") ? "border-green-500" : "border-red-500"}`} />
                                    <p className={`text-sm mt-1 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                                        {message}
                                    </p>
                                </>
                            )}

                        </form>

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
