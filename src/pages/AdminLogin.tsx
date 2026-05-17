// src/pages/AdminLogin.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role !== "admin" && profile?.role !== "super_admin") {
  await supabase.auth.signOut();
  throw new Error("Unauthorized: Not an admin account");
}

      await refreshProfile();
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Admin login failed");
      console.error("Admin login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="row justify-content-center"
      >
        <div className="col-md-5">
          <div className="card p-4 shadow-sm border-danger">
            <div className="text-center mb-3">
              <span className="badge bg-danger mb-2">ADMIN ONLY</span>
              <h2>🔒 Admin Login</h2>
              <p className="text-muted">Restricted access for administrators</p>
            </div>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleAdminLogin}>
              <div className="mb-3">
                <label className="form-label">Admin Email</label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Admin Password</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                className="btn btn-danger w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Admin Login"}
              </button>
            </form>

            <div className="text-center mt-3">
              <a href="/login" className="text-muted small">
                ← Back to user login
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}