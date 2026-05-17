// src/pages/SuperAdmin.tsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./Admin.css"; // Reuse admin styles

type Company = {
  id: string;
  name: string;
  created_at: string;
};

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  company_id: string | null;
  companies?: { name: string } | null;
};

export default function SuperAdmin() {
  const { profile } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<"companies" | "users">("companies");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCompanies = async () => {
    const { data } = await supabase.from("companies").select("*").order("created_at", { ascending: false });
    setCompanies(data || []);
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*, companies(name)")
      .order("created_at", { ascending: false });
    setUsers(data || []);
  };

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
  }, []);

  // Create new company
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("companies").insert([
      { name: newCompanyName.trim(), created_by: profile?.id },
    ]);

    if (error) {
      alert("Failed to create company: " + error.message);
    } else {
      setNewCompanyName("");
      fetchCompanies();
    }
    setLoading(false);
  };

  // Delete company
  const handleDeleteCompany = async (id: string) => {
    if (!window.confirm("Delete this company? This may affect users and designs.")) return;
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) alert("Failed to delete: " + error.message);
    else fetchCompanies();
  };

  // Change user role
  const handleChangeRole = async (userId: string, newRole: string) => {
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    if (error) alert("Failed to update role: " + error.message);
    else fetchUsers();
  };

  // Assign user to company
  const handleAssignCompany = async (userId: string, companyId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ company_id: companyId || null })
      .eq("id", userId);
    if (error) alert("Failed to assign company: " + error.message);
    else fetchUsers();
  };

  return (
    <div className="admin-page">
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="admin-header">
              <div>
                <h1>🛡️ Super Admin Dashboard</h1>
                <p className="text-muted">Manage all companies and users</p>
              </div>
              <div className="admin-mode-badge" style={{ background: "linear-gradient(135deg, #6b21a8, #a855f7)" }}>
                ⚡ Super Admin
              </div>
            </div>

            <ul className="admin-nav-tabs nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "companies" ? "active" : ""}`}
                  onClick={() => setActiveTab("companies")}
                >
                  🏢 Companies ({companies.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                  onClick={() => setActiveTab("users")}
                >
                  👥 Users ({users.length})
                </button>
              </li>
            </ul>

            {/* Companies Tab */}
            {activeTab === "companies" && (
              <>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <form onSubmit={handleCreateCompany} className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="New company name..."
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn btn-pink" disabled={loading}>
                        {loading ? "Creating..." : "➕ Create"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="row">
                  {companies.length === 0 ? (
                    <div className="col-12">
                      <div className="admin-empty-state">
                        <div className="admin-empty-icon">🏢</div>
                        <h4>No companies yet</h4>
                        <p className="text-muted">Create your first company above.</p>
                      </div>
                    </div>
                  ) : (
                    companies.map((company) => (
                      <div key={company.id} className="col-md-4 col-lg-3 mb-3">
                        <div className="card p-3 shadow-sm" style={{ borderRadius: "16px" }}>
                          <h6 className="fw-bold">{company.name}</h6>
                          <p className="small text-muted">
                            Created: {new Date(company.created_at).toLocaleDateString()}
                          </p>
                          <button
                            className="btn btn-danger btn-sm w-100"
                            onClick={() => handleDeleteCompany(company.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="row">
                {users.length === 0 ? (
                  <div className="col-12">
                    <div className="admin-empty-state">
                      <div className="admin-empty-icon">👥</div>
                      <h4>No users yet</h4>
                    </div>
                  </div>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card p-3 shadow-sm" style={{ borderRadius: "16px" }}>
                        <div className="d-flex justify-content-between mb-2">
                          <h6 className="fw-bold mb-0">{user.full_name || "No name"}</h6>
                          <span className={`badge ${
                            user.role === "super_admin" ? "bg-dark" :
                            user.role === "admin" ? "bg-danger" :
                            "bg-info"
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="small text-muted mb-1">{user.email}</p>
                        <p className="small text-muted mb-2">
                          Company: {user.companies?.name || "None"}
                        </p>

                        {/* Role Select */}
                        <div className="mb-2">
                          <label className="form-label small fw-bold mb-1">Change Role:</label>
                          <select
                            className="form-select form-select-sm"
                            value={user.role}
                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </div>

                        {/* Company Select */}
                        <div className="mb-2">
                          <label className="form-label small fw-bold mb-1">Assign Company:</label>
                          <select
                            className="form-select form-select-sm"
                            value={user.company_id || ""}
                            onChange={(e) => handleAssignCompany(user.id, e.target.value)}
                          >
                            <option value="">None</option>
                            {companies.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}