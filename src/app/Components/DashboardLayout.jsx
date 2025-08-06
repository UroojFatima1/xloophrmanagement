"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ role, children })
{
    const router = useRouter();

    const handleLogout = async () =>
    {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/');
    };
    const [isOpen, setIsOpen] = useState(false);

    const links =
        role === "admin"
            ? [
                { href: "/admin/admindashboard", label: "Dashboard" },
                { href: "/admin/manageemployees", label: "Manage Employees" },
                //{ href: "/user/history", label: "Attendance History" },
                //{ href: "/user/payroll", label: "Payroll" },
            ]
            : [
                { href: "/user/employee/employeedashboard", label: "Dashboard" },
                { href: "/user/employee/attendance", label: "Mark Attendance" },
                //{ href: "/user/history", label: "Attendance History" },
                //{ href: "/user/payroll", label: "Payroll" },
            ];
    const capitalizedRole = role?.toUpperCase() || "";

    return (
        <div className="flex flex-col md:flex-row min-h-screen">

            <div className="md:hidden bg-blue-700 text-white flex items-center justify-between p-4">
                <h2 className="text-xl font-bold">{capitalizedRole} PANEL</h2>
                <button onClick={() => setIsOpen(!isOpen)}>
                    <Menu />
                </button>
            </div>

            <aside
                className={`bg-blue-700 text-white p-6 space-y-6 w-full md:w-64 ${isOpen ? "block" : "hidden"
                    } md:block`}
            >
                <h2 className="text-2xl font-bold hidden md:block">{capitalizedRole} PANEL</h2>
                <nav className="space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block hover:bg-blue-600 p-2 rounded"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        onClick={handleLogout}
                        href="/"
                        className="block hover:bg-blue-600 p-2 rounded"

                    >
                        Logout
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </div>
    );
}
