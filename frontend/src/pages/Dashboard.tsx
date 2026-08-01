import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import {
  Users,
  FileWarning,
  Clock,
  CheckCircle,
  LogOut,
} from "lucide-react";

function Dashboard() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

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

      console.log(error);

    }

  };

  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-red-600">

          User Dashboard

        </h1>

        <p className="text-xl mt-2">

          Welcome,

          <span className="font-bold text-blue-600 ml-2">

            {user?.fullName}

          </span>

        </p>

        <div className="grid md:grid-cols-4 gap-6 mt-10">

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl duration-300">

            <Users size={45} className="text-blue-600 mb-3" />

            <h2 className="text-3xl font-bold">

              {stats.totalUsers}

            </h2>

            <p className="text-gray-600">

              Registered Users

            </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl duration-300">

            <FileWarning size={45} className="text-red-600 mb-3" />

            <h2 className="text-3xl font-bold">

              {stats.totalIncidents}

            </h2>

            <p className="text-gray-600">

              Total Reports

            </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl duration-300">

            <Clock size={45} className="text-yellow-500 mb-3" />

            <h2 className="text-3xl font-bold">

              {stats.pendingIncidents}

            </h2>

            <p className="text-gray-600">

              Pending Reports

            </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl duration-300">

            <CheckCircle size={45} className="text-green-600 mb-3" />

            <h2 className="text-3xl font-bold">

              {stats.approvedIncidents}

            </h2>

            <p className="text-gray-600">

              Approved Reports

            </p>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-lg mt-10 p-8">

          <h2 className="text-2xl font-bold mb-6">

            User Information

          </h2>

          <table className="w-full">

            <tbody>

              <tr className="border-b">

                <td className="py-4 font-semibold">

                  Full Name

                </td>

                <td>

                  {user?.fullName}

                </td>

              </tr>

              <tr className="border-b">

                <td className="py-4 font-semibold">

                  Email

                </td>

                <td>

                  {user?.email}

                </td>

              </tr>

              <tr>

                <td className="py-4 font-semibold">

                  Role

                </td>

                <td>

                  {user?.role}

                </td>

              </tr>

            </tbody>

          </table>

        </div>

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center gap-2"
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </div>

  );

}

export default Dashboard;