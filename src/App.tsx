import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Designs from "./pages/Designs";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SuperAdmin from "./pages/SuperAdmin";
import CompanySettings from "./pages/CompanySettings";

function ProtectedRoute({
  children,
  adminOnly = false,
  superAdminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" style={{ color: "#ec4899" }} role="status" />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (superAdminOnly && profile?.role !== "super_admin") {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && profile?.role !== "admin" && profile?.role !== "super_admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" style={{ color: "#ec4899" }} role="status" />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/designs" element={<ProtectedRoute><Designs /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin routes – accessible by admin or super_admin */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />

        {/* Super Admin only */}
        <Route path="/super-admin" element={<ProtectedRoute superAdminOnly><SuperAdmin /></ProtectedRoute>} />
        <Route path="/company-settings" element={<ProtectedRoute adminOnly><CompanySettings /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

export default App;