// src/pages/Contact.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Contact.css";

export default function Contact() {
  const { profile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const companyName = profile?.company_name || "Ezer NailArt";
  const companyPhone = profile?.company_phone || "+1 (555) 123-4567";
  const companyEmail = profile?.company_email || "hello@ezernailart.com";
  const companyAddress = profile?.company_address || "123 Nail Art Street, Beauty District, New York, NY 10001";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-badge">GET IN TOUCH</span>
          <h1>Contact {companyName}</h1>
          <p>We'd love to hear from you. Reach out and we'll get back to you shortly.</p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="contact-main">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Contact Info Cards */}
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">📍</div>
                <h4>Visit Us</h4>
                <p>{companyAddress}</p>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <h4>Call Us</h4>
                <p>{companyPhone}<br />Mon - Sat: 9:00 AM - 7:00 PM</p>
              </div>

              <div className="info-card">
                <div className="info-icon">✉️</div>
                <h4>Email Us</h4>
                <p>{companyEmail}</p>
              </div>

              <div className="info-card">
                <div className="info-icon">💬</div>
                <h4>Follow Us</h4>
                <div className="social-icons">
                  {profile?.company_instagram && <span>📸</span>}
                  {profile?.company_facebook && <span>📘</span>}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-card">
              <h3>Send Us a Message</h3>

              {submitted && (
                <div className="alert alert-success-custom">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit">
                  Send Message ✨
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="contact-map">
        <div className="map-placeholder">
          <div className="map-content">
            <span style={{ fontSize: "3rem" }}>📍</span>
            <h3>Visit {companyName}</h3>
            <p>{companyAddress}</p>
          </div>
        </div>
      </section>
    </div>
  );
}