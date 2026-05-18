// src/pages/Register.tsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Register.css";

type Company = {
  id: string;
  name: string;
};

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await supabase.from("companies").select("id, name").order("name");
      setCompanies(data || []);
    };
    fetchCompanies();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!selectedCompany) {
      setError("Please select a company");
      setLoading(false);
      return;
    }

    try {
      // 1. Sign up - trigger handles profile creation + email confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Signup error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No user returned from signup");
      }

      console.log("User signed up successfully:", authData.user.id);

      // 2. Wait for trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Update profile with user details
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone_number: phone,
          company_id: selectedCompany,
        })
        .eq("id", authData.user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        
        // If update fails, the profile might not exist - insert it
        const { error: insertError } = await supabase
          .from("profiles")
          .upsert({
            id: authData.user.id,
            email: email,
            full_name: fullName,
            phone_number: phone,
            role: "user",
            company_id: selectedCompany,
          });

        if (insertError) {
          console.error("Profile insert error:", insertError);
          throw new Error("Failed to save profile: " + insertError.message);
        }
      }

      console.log("Registration complete!");
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/login");
      }, 2500);
      
    } catch (err: any) {
      console.error("Full registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
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

              {success && (
                <div className="alert-success-custom mb-3">
                  🎉 Account created successfully! Redirecting to login...
                </div>
              )}

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
                    {password.length > 0
                      ? isPasswordValid
                        ? '✅ Password meets requirements'
                        : '❌ Minimum 6 characters required'
                      : '🔒 Choose a strong password'}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Company *</label>
                  <select
                    className="form-select"
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    required
                    style={{
                      borderRadius: "14px",
                      border: "2px solid #f3f4f6",
                      padding: "0.9rem 1.1rem",
                      fontSize: "0.95rem",
                      background: "#fafafa",
                    }}
                  >
                    <option value="">Choose your company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
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