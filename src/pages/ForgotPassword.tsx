// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("✅ Check your email for the reset link!");
    }
    setLoading(false);
  };

  return (
    <div className="container py-5" style={{ maxWidth: "440px" }}>
      <div className="card p-4 shadow-sm" style={{ borderRadius: "16px" }}>
        <h3 className="text-center mb-3">Forgot Password</h3>
        <p className="text-muted text-center small mb-4">
          Enter your email and we'll send you a reset link.
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleReset}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-pink w-100"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none small">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}