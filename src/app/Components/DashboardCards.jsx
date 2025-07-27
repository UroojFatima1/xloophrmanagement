import { FaUserTie, FaUsers, FaMoneyBill } from "react-icons/fa";

function Card({ icon, label, value, color })
{
    return (
        <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
            <div className={`text-3xl text-${color}-500`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <h3 className="text-xl font-bold">{value}</h3>
            </div>
        </div>
    );
}

export default function DashboardCards({ cards })
{
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
                <Card key={idx} {...card} />
            ))}
        </div>
    );
}