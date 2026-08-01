import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu, X, LogOut, User, LayoutDashboard, Moon, Sun,
  Shield, Map, Bell, FileText, BarChart3
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDarkMode } from "../../context/DarkModeContext";
import Notifications from "../common/Notifications";

function Navbar() {

  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Report Incident", path: "/report" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Reports", path: "/my-reports" },
    { name: "Live Map", path: "/live-map" },
    { name: "Profile", path: "/profile" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/admin", icon: <LayoutDashboard size={16} /> },
    { name: "Analytics", path: "/admin/analytics", icon: <BarChart3 size={16} /> },
    { name: "Users", path: "/admin/users", icon: <Shield size={16} /> },
  ];

  return (
    <nav className="bg-red-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          <Link to="/" className="text-white text-2xl font-bold">
            🚨 Emergency Reporting
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 font-semibold"
                    : "text-white hover:text-yellow-300"
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-white hover:text-yellow-300 transition"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <>

                {/* Admin Links */}
                {user.role === "ADMIN" && (
                  <div className="flex items-center gap-2 mr-2">
                    {adminLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="bg-purple-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-purple-800"
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Notifications */}
                <Notifications />

                <span className="text-white font-semibold text-sm">
                  {user.email}
                </span>

                <Link
                  to="/profile"
                  className="bg-white text-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <User size={18} />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </>
            ) : (
              <>

                <Link
                  to="/login"
                  className="bg-white text-red-600 px-4 py-2 rounded-lg"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold"
                >
                  Register
                </Link>

              </>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded ${
                      isActive
                        ? "bg-red-800 text-yellow-300"
                        : "text-white hover:bg-red-700"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Mobile Admin Links */}
              {user?.role === "ADMIN" && (
                <>
                  <div className="border-t border-red-400 my-2"></div>
                  {adminLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-white bg-purple-700 rounded flex items-center gap-2"
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile Auth */}
              <div className="border-t border-red-400 my-2"></div>
              {user ? (
                <>
                  <button
                    onClick={toggleDarkMode}
                    className="px-4 py-2 text-white flex items-center gap-2"
                  >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="px-4 py-2 bg-black text-white rounded flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-white text-red-600 rounded text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-yellow-400 rounded text-center font-semibold"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
