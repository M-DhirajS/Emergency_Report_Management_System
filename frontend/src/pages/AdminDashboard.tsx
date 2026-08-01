import { useEffect, useState } from "react";
import api from "../services/api";

import DashboardCards from "../components/admin/DashboardCards";
import AdminCharts from "../components/admin/AdminCharts";

interface Incident {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  status: string;
  image: string;
}

function AdminDashboard() {

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIncidents: 0,
    pendingIncidents: 0,
    approvedIncidents: 0,
    rejectedIncidents: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const incidentResponse = await api.get("/incidents");
      setIncidents(incidentResponse.data);

      const statsResponse = await api.get("/dashboard/stats");
      setStats(statsResponse.data);

    } catch (error) {

      console.log(error);

    }

  };

  const approveIncident = async (id: number) => {

    try {

      await api.put(`/incidents/approve/${id}`);

      loadDashboard();

    } catch (error) {

      console.log(error);

      alert("Failed to approve incident");

    }

  };

  const rejectIncident = async (id: number) => {

    try {

      await api.put(`/incidents/reject/${id}`);

      loadDashboard();

    } catch (error) {

      console.log(error);

      alert("Failed to reject incident");

    }

  };

  const deleteIncident = async (id: number) => {

    if (!window.confirm("Delete this incident?")) return;

    try {

      await api.delete(`/incidents/${id}`);

      loadDashboard();

    } catch (error) {

      console.log(error);

      alert("Failed to delete incident");

    }

  };

  const filteredIncidents = incidents.filter((incident) => {

    const matchSearch =
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.category.toLowerCase().includes(search.toLowerCase()) ||
      incident.location.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" ||
      incident.status === statusFilter;

    return matchSearch && matchStatus;

  });

  const getStatusColor = (status: string) => {

    switch (status) {

      case "Approved":
        return "bg-green-500 text-white";

      case "Rejected":
        return "bg-red-500 text-white";

      default:
        return "bg-yellow-400 text-black";

    }

  };

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-5xl font-bold text-center text-red-600 mb-8">
        Admin Dashboard
      </h1>

      <DashboardCards
        totalUsers={stats.totalUsers}
        totalIncidents={stats.totalIncidents}
        pendingIncidents={stats.pendingIncidents}
        approvedIncidents={stats.approvedIncidents}
        rejectedIncidents={stats.rejectedIncidents}
      />

      <AdminCharts
        pending={stats.pendingIncidents}
        approved={stats.approvedIncidents}
        rejected={stats.rejectedIncidents}
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <input
          type="text"
          placeholder="Search Incident..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full md:w-1/2"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-3 rounded-lg w-full md:w-60"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full bg-white rounded-xl shadow-lg">

          <thead className="bg-red-600 text-white">

            <tr>

              <th className="p-4">ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Description</th>
              <th className="p-4">Location</th>
              <th className="p-4">Image</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>

            </tr>

          </thead>

          <tbody>
            {filteredIncidents.map((incident) => (

              <tr
                key={incident.id}
                className="border-b hover:bg-gray-100"
              >

                <td className="p-4">
                  {incident.id}
                </td>

                <td className="p-4 font-semibold">
                  {incident.title}
                </td>

                <td className="p-4">
                  {incident.category}
                </td>

                <td className="p-4">
                  {incident.description}
                </td>

                <td className="p-4">
                  {incident.location}
                </td>

                <td className="p-4">

                  {incident.image ? (

                    <img
                      src={`http://localhost:8080/uploads/${incident.image}`}
                      alt="Incident"
                      className="w-24 h-20 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
                      onClick={() =>
                        window.open(
                          `http://localhost:8080/uploads/${incident.image}`,
                          "_blank"
                        )
                      }
                    />

                  ) : (

                    <span className="text-gray-500">
                      No Image
                    </span>

                  )}

                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full font-bold ${getStatusColor(
                      incident.status
                    )}`}
                  >
                    {incident.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() => approveIncident(incident.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectIncident(incident.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => deleteIncident(incident.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {filteredIncidents.length === 0 && (

              <tr>

                <td
                  colSpan={8}
                  className="text-center p-10 text-gray-500 text-lg"
                >

                  No Incidents Found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default AdminDashboard;