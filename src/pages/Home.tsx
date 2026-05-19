// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const features = [
    {
      icon: "💎",
      title: "Premium Quality",
      description: "Top-tier products and techniques",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
      action: () => navigate("/designs")
    },
    {
      icon: "⚡",
      title: "Fast Booking",
      description: "Book in under 60 seconds",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop",
      action: () => navigate("/booking")
    },
    {
      icon: "🎨",
      title: "Custom Designs",
      description: "Unique styles just for you",
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=300&fit=crop",
      action: () => navigate("/designs")
    }
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1601055283742-8b27e81b4d2c?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop"
  ];

  const handleBookNow = () => {
    if (user) {
      navigate("/booking");
    } else {
      navigate("/login");
    }
  };

  const handleViewGallery = () => {
    navigate("/designs");
  };

  const handleGalleryClick = () => {
    navigate("/designs");
  };

  // Company-specific content
  const companyName = profile?.company_name || "Ezer NailArt";
  const heroTitle = profile?.company_hero_title || "Where Beauty Meets Professional Art";
  const heroSubtitle = profile?.company_hero_subtitle || "Transform your nails into stunning masterpieces. Our expert artists create breathtaking designs that reflect your unique style and personality.";

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
        <div className="bg-dots"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-grid">
            <div className="hero-left">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                <span>✨ {companyName}</span>
              </div>

              <h1 className="hero-title">
                {heroTitle.includes("Beauty") ? (
                  <>Where <span className="title-highlight">Beauty</span> Meets<br />Professional <span className="title-highlight">Art</span></>
                ) : (
                  heroTitle
                )}
              </h1>

              <p className="hero-description">
                {heroSubtitle}
              </p>

              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Happy Clients</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">💅</div>
                  <div className="stat-number">150+</div>
                  <div className="stat-label">Unique Designs</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-number">4.9</div>
                  <div className="stat-label">Client Rating</div>
                </div>
              </div>

              <div className="cta-buttons">
                <button className="btn-primary" onClick={handleBookNow}>
                  <span>Book Appointment</span>
                  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="btn-secondary" onClick={handleViewGallery}>
                  <span>View Gallery</span>
                  <svg className="btn-play" viewBox="0 0 24 24" fill="none">
                    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-image-wrapper">
                <div className="hero-main-image" onClick={() => navigate("/designs")} style={{ cursor: "pointer" }}>
                  <img 
                    src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=700&fit=crop"
                    alt="Nail Art"
                    className="main-img"
                  />
                  <div className="image-overlay"></div>
                </div>
                
                <div className="floating-card card-1" onClick={() => navigate("/designs")}>
                  <div className="card-emoji">💎</div>
                  <div className="card-text">
                    <div className="card-title">Premium</div>
                    <div className="card-subtitle">Quality Products</div>
                  </div>
                </div>

                <div className="floating-card card-2" onClick={handleBookNow}>
                  <div className="card-emoji">⚡</div>
                  <div className="card-text">
                    <div className="card-title">Fast</div>
                    <div className="card-subtitle">Instant Booking</div>
                  </div>
                </div>

                <div className="floating-card card-3" onClick={() => navigate("/designs")}>
                  <div className="card-emoji">🎨</div>
                  <div className="card-text">
                    <div className="card-title">150+</div>
                    <div className="card-subtitle">Nail Designs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="gallery-strip">
        <div className="gallery-track">
          {[...galleryImages, ...galleryImages].map((img, index) => (
            <div key={index} className="gallery-item" onClick={handleGalleryClick}>
              <img src={img} alt={`Nail design ${index + 1}`} />
              <div className="gallery-item-overlay">
                <span className="gallery-zoom">🔍</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">WHY CHOOSE US</span>
          <h2 className="section-title">The Perfect Nail Experience</h2>
          <p className="section-description">
            We combine artistry with premium products to give you the nails you've always dreamed of
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-image-wrapper" onClick={feature.action} style={{ cursor: "pointer" }}>
                <img src={feature.image} alt={feature.title} className="feature-image" />
                <div className="feature-image-shine"></div>
              </div>
              <div className="feature-content">
                <div className="feature-icon-circle">
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <button className="feature-link" onClick={feature.action}>
                  Learn More
                  <svg className="link-arrow" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <div className="cta-card">
          <div className="cta-pattern"></div>
          <div className="cta-content">
            <div className="cta-left">
              <h2 className="cta-title">Ready to Transform Your Nails?</h2>
              <p className="cta-description">
                Book your appointment today and get 20% off your first visit!
              </p>
              <div className="cta-buttons-group">
                <button className="btn-cta-white" onClick={handleBookNow}>
                  <span>Book Your Session</span>
                  <svg className="cta-arrow" viewBox="0 0 24 24" fill="none">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button className="btn-cta-outline" onClick={() => navigate("/designs")}>
                  <span>View Services</span>
                </button>
              </div>
            </div>
            <div className="cta-right">
              <div className="cta-image-grid">
                <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=150&h=150&fit=crop" alt="Nail 1" className="cta-img cta-img-1" onClick={() => navigate("/designs")} />
                <img src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=150&h=150&fit=crop" alt="Nail 2" className="cta-img cta-img-2" onClick={() => navigate("/designs")} />
                <img src="https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=150&h=150&fit=crop" alt="Nail 3" className="cta-img cta-img-3" onClick={() => navigate("/designs")} />
                <img src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=150&h=150&fit=crop" alt="Nail 4" className="cta-img cta-img-4" onClick={() => navigate("/designs")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">💅 {companyName}</span>
            <p className="footer-tagline">Making the world beautiful, one nail at a time.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Services</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/designs"); }}>Manicure</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/designs"); }}>Pedicure</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/designs"); }}>Nail Art</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/designs"); }}>Gel Nails</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>About Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/booking"); }}>Careers</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/designs"); }}>Blog</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>Contact</a>
            </div>
            <div className="footer-col">
              <h4>Follow Us</h4>
              <div className="social-links">
                {profile?.company_instagram && (
                  <a href={profile.company_instagram} className="social-link" target="_blank" rel="noopener noreferrer">📸</a>
                )}
                {profile?.company_facebook && (
                  <a href={profile.company_facebook} className="social-link" target="_blank" rel="noopener noreferrer">📘</a>
                )}
                {!profile?.company_instagram && !profile?.company_facebook && (
                  <>
                    <a href="#" className="social-link" onClick={(e) => e.preventDefault()}>📸</a>
                    <a href="#" className="social-link" onClick={(e) => e.preventDefault()}>📘</a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 {companyName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}