import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Layout from "../components/layout/Layout";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import AdminAnalytics from "../pages/AdminAnalytics";
import AdminUsers from "../pages/AdminUsers";
import Profile from "../pages/Profile";
import MyReports from "../pages/MyReports";
import ReportIncident from "../pages/ReportIncident";
import LiveMap from "../components/maps/LiveMap";
import NotFound from "../pages/NotFound";

/**
 * Application Routes configuration.
 * Public routes are wrapped in Layout component.
 * Protected routes require authentication.
 */
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />

        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <Layout>
              <ForgotPassword />
            </Layout>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportIncident />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/live-map"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-8">
                    🗺️ Live Incident Map
                  </h1>
                  <LiveMap />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
