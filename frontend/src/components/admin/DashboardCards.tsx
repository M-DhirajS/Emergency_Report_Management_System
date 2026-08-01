import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Props {
  totalUsers: number;
  totalIncidents: number;
  pendingIncidents: number;
  approvedIncidents: number;
  rejectedIncidents: number;
}

function DashboardCards({
  totalUsers,
  totalIncidents,
  pendingIncidents,
  approvedIncidents,
  rejectedIncidents,
}: Props) {

  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      color: "bg-blue-500",
      icon: <Users size={35} />,
    },

    {
      title: "Total Incidents",
      value: totalIncidents,
      color: "bg-red-500",
      icon: <AlertTriangle size={35} />,
    },

    {
      title: "Pending",
      value: pendingIncidents,
      color: "bg-yellow-500",
      icon: <Clock size={35} />,
    },

    {
      title: "Approved",
      value: approvedIncidents,
      color: "bg-green-500",
      icon: <CheckCircle size={35} />,
    },

    {
      title: "Rejected",
      value: rejectedIncidents,
      color: "bg-gray-700",
      icon: <XCircle size={35} />,
    },
  ];

  return (

    <div className="grid md:grid-cols-5 gap-6 mb-10">

      {cards.map((card, index) => (

        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl duration-300"
        >

          <div
            className={`${card.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-5`}
          >

            {card.icon}

          </div>

          <h2 className="text-3xl font-bold">

            {card.value}

          </h2>

          <p className="text-gray-600 mt-2">

            {card.title}

          </p>

        </div>

      ))}

    </div>

  );

}

export default DashboardCards;