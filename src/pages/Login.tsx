// src/pages/Login.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await refreshProfile();
      console.log("Login success 🎉", data);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="row justify-content-center"
        >
          <div className="col-md-5 col-lg-4">
            <div className="login-card">
              <h2 className="text-center mb-4">🔐 Welcome Back</h2>

              {/* Error Alert */}
              {error && (
                <div className="alert-danger-custom mb-3">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="login-btn mb-3"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Logging in...
                    </>
                  ) : (
                    "✨ Login"
                  )}
                </button>
              </form>

              <div className="login-divider">
                <span>or</span>
              </div>

              <div className="text-center">
                <p className="mb-2">
                  <Link to="/register">
                    Don't have an account? Register here
                  </Link>
                </p>
                <Link to="/admin/login" className="admin-link-text">
                  🔒 Admin Login
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}