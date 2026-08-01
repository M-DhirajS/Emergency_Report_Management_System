import { useEffect, useState } from "react";
import api from "../services/api";
import { Search, Ban, Trash2, Shield } from "lucide-react";

interface User {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  blocked: boolean;
  profilePicture: string;
}

/**
 * Admin User Management page.
 * Allows admin to view, search, block/unblock, and delete users.
 */
function AdminUsers() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users${search ? `?search=${search}` : ""}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadUsers(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  /**
   * Toggle block/unblock user.
   */
  const toggleBlock = async (userId: number) => {
    try {
      const response = await api.put(`/admin/users/${userId}/toggle-block`);
      // Update local state
      setUsers(users.map(u =>
        u.id === userId ? { ...u, blocked: !u.blocked } : u
      ));
    } catch (error) {
      console.error("Failed to toggle block:", error);
      alert("Failed to update user");
    }
  };

  /**
   * Delete user with confirmation.
   */
  const deleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-red-600">
            👥 User Management
          </h1>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="font-semibold">Total Users: </span>
            <span className="text-red-600 font-bold">{users.length}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 p-3 pl-10 rounded-lg w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading users...</p>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="w-full">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Mobile</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-12 text-gray-500">
                      <div className="text-4xl mb-4">👥</div>
                      <p>No users found</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <span className="font-medium">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4 text-gray-600">{user.mobile || "N/A"}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.blocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {user.blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => toggleBlock(user.id)}
                            className={`px-3 py-2 rounded text-sm font-semibold transition ${
                              user.blocked
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-yellow-500 hover:bg-yellow-600 text-white"
                            }`}
                            title={user.blocked ? "Unblock" : "Block"}
                          >
                            {user.blocked ? "Unblock" : "Block"}
                          </button>
                          <button
                            onClick={() => deleteUser(user.id, user.fullName)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                            title="Delete User"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;

