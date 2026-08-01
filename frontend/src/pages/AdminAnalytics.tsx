import { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, CartesianGrid, XAxis, YAxis,
  LineChart, Line,
} from "recharts";

const COLORS = ["#facc15", "#22c55e", "#ef4444", "#3b82f6", "#a855f7", "#f97316"];

/**
 * Admin Analytics page with detailed charts.
 * Shows category-wise, monthly trends, and status breakdowns.
 */
function AdminAnalytics() {

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await api.get("/admin/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-gray-500">
        Failed to load analytics data
      </div>
    );
  }

  const categoryData = analytics.categoryWise || [];
  const monthlyData = analytics.monthlyTrends || [];
  const statusData = analytics.statusBreakdown || {};

  // Format status data for pie chart
  const statusPieData = [
    { name: "Pending", value: statusData.pending || 0 },
    { name: "Approved", value: statusData.approved || 0 },
    { name: "Rejected", value: statusData.rejected || 0 },
  ];

  const statusColors = ["#facc15", "#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-8">
          📊 Admin Analytics
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-3xl font-bold">{analytics.totalUsers || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Incidents</p>
            <p className="text-3xl font-bold">{analytics.totalIncidents || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-500">{statusData.pending || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Approved</p>
            <p className="text-3xl font-bold text-green-500">{statusData.approved || 0}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">

          {/* Pie Chart - Status Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-5 text-center">Incident Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusPieData} dataKey="value" outerRadius={100} label>
                  {statusPieData.map((_entry, index) => (
                    <Cell key={index} fill={statusColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Category Wise */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-5 text-center">Category-wise Incidents</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Monthly Trends */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
            <h2 className="text-xl font-bold mb-5 text-center">Monthly Incident Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Export Button */}
        <div className="text-center">
          <a
            href="http://localhost:8080/api/admin/export/excel"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            📥 Export All Incidents (Excel)
          </a>
        </div>

      </div>
    </div>
  );
}

export default AdminAnalytics;
