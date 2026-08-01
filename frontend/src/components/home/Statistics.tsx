import { useEffect, useState } from "react";
import { Bell, Home, Users, MapPin } from "lucide-react";
import api from "../../services/api";

function Statistics() {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalIncidents: 0,
        pendingIncidents: 0,
        approvedIncidents: 0,
        rejectedIncidents: 0,
    });

    useEffect(() => {

        fetchDashboardStats();

    }, []);

    const fetchDashboardStats = async () => {

        try {

            const response = await api.get("/dashboard/stats");

            setStats(response.data);

        } catch (error) {

            console.error("Error fetching dashboard stats", error);

        }

    };

    const cards = [

        {
            icon: <Users size={40} />,
            number: stats.totalUsers,
            title: "Registered Users",
            color: "bg-blue-500",
        },

        {
            icon: <Bell size={40} />,
            number: stats.totalIncidents,
            title: "Total Incidents",
            color: "bg-red-500",
        },

        {
            icon: <Home size={40} />,
            number: stats.pendingIncidents,
            title: "Pending Reports",
            color: "bg-yellow-500",
        },

        {
            icon: <MapPin size={40} />,
            number: stats.approvedIncidents,
            title: "Approved Reports",
            color: "bg-green-500",
        },

    ];

    return (

        <section className="py-20 bg-gray-100">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center mb-12">

                    Emergency Statistics

                </h2>

                <div className="grid md:grid-cols-4 gap-8">

                    {cards.map((item, index) => (

                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 duration-300"
                        >

                            <div
                                className={`${item.color} w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto mb-6`}
                            >

                                {item.icon}

                            </div>

                            <h1 className="text-5xl font-bold mb-2">

                                {item.number}

                            </h1>

                            <p className="text-gray-600 text-lg">

                                {item.title}

                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}

export default Statistics;