import DashboardLayout from "../../Components/DashboardLayout";
import DashboardCards from "../../Components/DashboardCards";
import { FaUserTie, FaUsers, FaMoneyBill } from "react-icons/fa";

const employeeCards = [
    { icon: <FaUserTie />, label: "Employees", value: "14 Total", color: "blue" },
    { icon: <FaUsers />, label: "Attendance Today", value: "10 Marked", color: "yellow" },
    { icon: <FaMoneyBill />, label: "Payroll Processed", value: "$12,000", color: "green" },
];


export default function AdminDashboard()
{
    return (
        <DashboardLayout role="admin">
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Employee Dashboard</h1>
                <p className="text-gray-500">Manage your workforce efficiently</p>
            </div>
            <DashboardCards cards={employeeCards} />
        </DashboardLayout>
    );
}


