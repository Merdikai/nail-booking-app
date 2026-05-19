// src/pages/CompanySettings.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

type CompanyData = {
  id: string;
  name: string;
  logo_url: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  mission_text: string;
  vision_text: string;
  phone: string;
  address: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
};

export default function CompanySettings() {
  const { profile } = useAuth();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile?.company_id) {
      fetchCompany();
    }
  }, [profile]);

  const fetchCompany = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("companies")
      .select("*")
      .eq("id", profile?.company_id)
      .single();
    setCompany(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setSaving(true);
    setSuccess("");
    setError("");

    const { error: updateError } = await supabase
      .from("companies")
      .update({
        logo_url: company.logo_url,
        hero_title: company.hero_title,
        hero_subtitle: company.hero_subtitle,
        about_text: company.about_text,
        mission_text: company.mission_text,
        vision_text: company.vision_text,
        phone: company.phone,
        address: company.address,
        email: company.email,
        website: company.website,
        instagram: company.instagram,
        facebook: company.facebook,
      })
      .eq("id", company.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Company settings saved successfully! 🎉");
      setTimeout(() => setSuccess(""), 4000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: "#ec4899" }} role="status" />
        <p className="mt-2 text-muted">Loading company settings...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container py-5 text-center">
        <h3>No company found</h3>
        <p className="text-muted">Please contact your super admin.</p>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">🏢 Company Settings</h2>
      <p className="text-muted mb-4">Customize how your nail salon appears to customers.</p>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSave}>
        {/* Branding Section */}
        <div className="card p-4 mb-4 shadow-sm" style={{ borderRadius: "16px" }}>
          <h5 className="fw-bold mb-3">🎨 Branding</h5>
          
          <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input type="text" className="form-control" value={company.name} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label">Logo URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://example.com/logo.png"
              value={company.logo_url || ""}
              onChange={(e) => setCompany({ ...company, logo_url: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Hero Title (shown on home page)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Where Beauty Meets Art"
              value={company.hero_title || ""}
              onChange={(e) => setCompany({ ...company, hero_title: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Hero Subtitle</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g., Premium nail services in your city"
              value={company.hero_subtitle || ""}
              onChange={(e) => setCompany({ ...company, hero_subtitle: e.target.value })}
            />
          </div>
        </div>

        {/* About Section */}
        <div className="card p-4 mb-4 shadow-sm" style={{ borderRadius: "16px" }}>
          <h5 className="fw-bold mb-3">📖 About Page</h5>

          <div className="mb-3">
            <label className="form-label">About Text</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Tell your story..."
              value={company.about_text || ""}
              onChange={(e) => setCompany({ ...company, about_text: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mission</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Our mission..."
              value={company.mission_text || ""}
              onChange={(e) => setCompany({ ...company, mission_text: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Vision</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Our vision..."
              value={company.vision_text || ""}
              onChange={(e) => setCompany({ ...company, vision_text: e.target.value })}
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="card p-4 mb-4 shadow-sm" style={{ borderRadius: "16px" }}>
          <h5 className="fw-bold mb-3">📞 Contact Info</h5>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="+1 (555) 123-4567"
                value={company.phone || ""}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="hello@salon.com"
                value={company.email || ""}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="123 Nail Art Street, NY"
              value={company.address || ""}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
            />
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Website</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://salon.com"
                value={company.website || ""}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Instagram</label>
              <input
                type="text"
                className="form-control"
                placeholder="@salon"
                value={company.instagram || ""}
                onChange={(e) => setCompany({ ...company, instagram: e.target.value })}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Facebook</label>
              <input
                type="text"
                className="form-control"
                placeholder="facebook.com/salon"
                value={company.facebook || ""}
                onChange={(e) => setCompany({ ...company, facebook: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-pink w-100" disabled={saving}>
          {saving ? "Saving..." : "💾 Save Settings"}
        </button>
      </form>
    </div>
  );
}