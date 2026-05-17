// src/pages/About.tsx
import { useNavigate } from "react-router-dom";
import "./About.css";

export default function About() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Ezer",
      role: "Founder & Lead Nail Artist",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      bio: "With 10+ years of experience in nail artistry.",
    },
    {
      name: "Sarah",
      role: "Senior Nail Technician",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      bio: "Specializing in gel and acrylic designs.",
    },
    {
      name: "Maya",
      role: "Creative Designer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      bio: "Bringing artistic visions to your nails.",
    },
    {
      name: "Luna",
      role: "Customer Experience Manager",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
      bio: "Ensuring every client leaves with a smile.",
    },
  ];

  const milestones = [
    { year: "2019", title: "Founded", description: "Ezer NailArt opened its first studio." },
    { year: "2020", title: "1000+ Clients", description: "Reached our first major milestone." },
    { year: "2022", title: "Award Winning", description: "Best Nail Studio in the region." },
    { year: "2024", title: "Online Booking", description: "Launched digital booking platform." },
    { year: "2026", title: "Premium Studio", description: "Expanded to premium location." },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">OUR STORY</span>
          <h1>About Ezer NailArt</h1>
          <p>
            We believe every nail is a canvas waiting to be transformed into a masterpiece.
            Since 2019, we've been creating stunning nail designs that empower our clients
            to express their unique style.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission">
        <div className="about-container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To provide exceptional nail care services using premium products
                and innovative techniques, ensuring every client feels beautiful
                and confident.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                To become the most trusted and innovative nail studio, setting
                new standards in nail artistry and customer experience across the region.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💖</div>
              <h3>Our Values</h3>
              <p>
                Quality craftsmanship, creativity without limits, exceptional hygiene
                standards, and personalized care for every single client.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="about-timeline">
        <div className="about-container">
          <div className="section-header">
            <span className="section-tag">OUR JOURNEY</span>
            <h2>How We Grew</h2>
          </div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-year">{milestone.year}</div>
                <div className="timeline-content">
                  <h4>{milestone.title}</h4>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="about-container">
          <div className="section-header">
            <span className="section-tag">MEET THE TEAM</span>
            <h2>Our Amazing Artists</h2>
            <p>The talented people behind every beautiful nail design.</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h4>{member.name}</h4>
                <span className="team-role">{member.role}</span>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-card">
          <h2>Ready to Experience the Best?</h2>
          <p>Book your appointment today and join our 500+ happy clients.</p>
          <button className="btn-pink btn-lg" onClick={() => navigate("/booking")}>
            Book Appointment ✨
          </button>
        </div>
      </section>
    </div>
  );
}