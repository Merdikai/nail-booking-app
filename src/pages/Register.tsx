// src/pages/Register.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Register.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("No user returned from auth");

      // 2. Create profile in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            full_name: fullName,
            phone_number: phone,
            email: email,
            role: "user",
          },
        ]);

      if (profileError) throw profileError;

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = password.length >= 6;

  return (
    <div className="register-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="row justify-content-center"
        >
          <div className="col-md-5 col-lg-4">
            <div className="register-card">
              <h2 className="text-center mb-4">💅 Create Account</h2>

              {/* Success Alert */}
              {success && (
                <div className="alert-success-custom mb-3">
                  🎉 Account created successfully! Redirecting to login...
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="alert-danger-custom mb-3">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-control"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

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
                    placeholder="Create password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <div className={`password-hint ${isPasswordValid && password.length > 0 ? 'valid' : ''}`}>
                    {password.length > 0 ? (
                      isPasswordValid ? '✅ Password meets requirements' : '❌ Minimum 6 characters required'
                    ) : (
                      '🔒 Choose a strong password'
                    )}
                  </div>
                </div>

                <button
                  className="register-btn mb-3"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating account...
                    </>
                  ) : (
                    "✨ Register"
                  )}
                </button>
              </form>

              <div className="register-divider">
                <span>or</span>
              </div>

              <div className="text-center">
                <Link to="/login">
                  Already have an account? Login here
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}