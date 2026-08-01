import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Incident {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  status: string;
  image: string;
  userEmail: string;
  createdAt: string;
}

/**
 * My Reports page - displays only the logged-in user's incident reports.
 * Features: search, image display, status badges, delete own reports.
 */
function MyReports() {

  const { user } = useAuth();
  const [reports, setReports] = useState<Incident[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      loadReports();
    }
  }, [user]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/incidents/user/${user?.email}`);
      setReports(response.data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await api.delete(`/incidents/${id}`);
      // Remove from local state for instant UI update
      setReports(reports.filter(r => r.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete report");
    }
  };

  // Filter reports based on search query
  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(search.toLowerCase()) ||
    report.category.toLowerCase().includes(search.toLowerCase()) ||
    report.location.toLowerCase().includes(search.toLowerCase()) ||
    report.status.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Returns appropriate badge styling based on incident status.
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-red-600">
              My Reports
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage your submitted incident reports
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="font-semibold">Total: </span>
            <span className="text-red-600 font-bold">{reports.length}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="🔍 Search by title, category, location, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 p-3 pl-10 rounded-lg w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your reports...</p>
          </div>
        )}

        {/* Reports Table (Desktop) */}
        {!loading && (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="w-full">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-12 text-gray-500">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-lg font-semibold">No Reports Found</p>
                      <p className="text-sm mt-2">
                        {search ? "Try a different search term" : "You haven't submitted any reports yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 font-medium">{report.title}</td>
                      <td className="p-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {report.category}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{report.location}</td>
                      <td className="p-4">
                        {report.image ? (
                          <img
                            src={`http://localhost:8080/uploads/${report.image}`}
                            alt="Incident"
                            className="w-20 h-16 rounded-lg object-cover border cursor-pointer hover:scale-110 transition"
                            onClick={() =>
                              window.open(
                                `http://localhost:8080/uploads/${report.image}`,
                                "_blank"
                              )
                            }
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">No Image</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards View */}
        {!loading && (
          <div className="md:hidden space-y-4 mt-6">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-gray-500">No Reports Found</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{report.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-semibold">Category:</span> {report.category}</p>
                    <p><span className="font-semibold">Location:</span> {report.location}</p>
                    <p><span className="font-semibold">Date:</span> {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A"}</p>
                  </div>
                  {report.image && (
                    <img
                      src={`http://localhost:8080/uploads/${report.image}`}
                      alt="Incident"
                      className="w-full h-40 object-cover rounded-lg my-3"
                    />
                  )}
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm w-full"
                  >
                    🗑 Delete Report
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReports;

