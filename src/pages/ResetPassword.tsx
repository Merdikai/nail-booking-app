// src/pages/ResetPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "440px" }}>
      <div className="card p-4 shadow-sm" style={{ borderRadius: "16px" }}>
        <h3 className="text-center mb-3">Set New Password</h3>

        {success && (
          <div className="alert alert-success">
            Password updated! Redirecting to login...
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="New password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-pink w-100">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}