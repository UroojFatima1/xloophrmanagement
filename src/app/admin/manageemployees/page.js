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
    const [selectedId, setSelectedId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        position: "",
        salary: "",
    });


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

    const handleDeleteClick = (id) =>
    {
        setSelectedId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () =>
    {
        if (!selectedId) return;

        try
        {
            const res = await fetch(`/api/manageemployee/${selectedId}`, {
                method: "DELETE",
            });

            if (!res.ok)
            {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to delete employee");
            }

            setEmployees((prev) => prev.filter((emp) => emp._id !== selectedId));
            setmessage("Employee deleted successfully");

        } catch (error)
        {
            console.error("Error deleting employee:", error);
            setmessage("Failed to delete employee");
        } finally
        {
            setShowConfirm(false);
            setSelectedId(null);

            setTimeout(() =>
            {
                setmessage("");
            }, 1500);
        }
    };

    const handleAddSubmit = async (e) =>
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
            setTimeout(() =>
            {
                setmessage("");
                setShowModal(false);
            }, 1500);

        } catch (error)
        {
            console.error("Error adding employee:", error);
            setmessage("Something went wrong. Please try again.");
        }
    };

    const handleEditClick = (id) =>
    {
        const employeeToEdit = employees.find(emp => emp._id === id);
        if (!employeeToEdit) return;

        setForm({
            name: employeeToEdit.name,
            email: employeeToEdit.email,
            position: employeeToEdit.position,
            salary: employeeToEdit.salary,
            password: "",
        });

        setEditId(id);
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleEditSubmit = async (e) =>
    {
        e.preventDefault();
        try
        {
            const { password, ...rest } = form;
            const res = await fetch(`/api/manageemployee/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rest),
            });
            const result = await res.json();
            if (!res.ok)
            {
                setmessage(result.error || "Failed to update employee");
                return;
            }
            setEmployees(prev =>
                prev.map(emp =>
                    emp._id === editingId ? { ...emp, ...rest } : emp
                )
            );
            setmessage("Employee updated successfully");
            setForm({ name: "", email: "", position: "", salary: "", password: "" });
            setIsEditMode(false);
            setEditId(null);
        }
        catch (error)
        {
            console.error("Error editing employee:", error);
            setmessage("Failed to edit employee");
        } finally
        {
            setShowModal(false);
            setTimeout(() =>
            {
                setmessage("");
            }, 1500);
        }
    }

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

                                            <button onClick={() => handleEditClick(emp._id)}
                                                className="text-yellow-600 hover:text-yellow-800">
                                                <FaPen />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteClick(emp._id)}
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
                    {message && !showModal && (
                        <p className={`mt-4 text-sm ${message.includes("deleted") || message.includes("updated") ? "text-green-600" : "text-red-600"}`}>
                            {message}
                        </p>
                    )}

                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
                        <form onSubmit={isEditMode ? handleEditSubmit : handleAddSubmit} className="space-y-4">
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
                                placeholder={isEditMode ? "Password (unchanged)" : "Password"}
                                className="w-full border border-gray-300 p-2 rounded"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                disabled={isEditMode}
                                required={!isEditMode}
                            />

                            <input
                                type="text"
                                placeholder="Position"
                                className="w-full border border-gray-300 p-2 rounded"
                                value={form.position ?? ""}
                                onChange={(e) => setForm({ ...form, position: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Salary"
                                className="w-full border border-gray-300 p-2 rounded"
                                value={form.salary !== undefined ? String(form.salary) : ""}
                                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                            />

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                    {
                                        setShowModal(false)
                                        setForm({ name: "", email: "", password: "", position: "", salary: "" }); setmessage("");
                                    }}
                                    className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                                    {isEditMode ? "Update" : "Add"}
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

            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
                        <h2 className="text-lg font-semibold mb-4">Delete Employee</h2>
                        <p className="mb-6 text-gray-700">Are you sure you want to delete this employee?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
}