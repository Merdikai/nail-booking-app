// src/components/Navbar.tsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".nav-dropdown")) {
        setDropdownOpen(false);
      }
      if (
        !target.closest(".nav-menu") &&
        !target.closest(".nav-toggle")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    setDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const closeAll = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  return (
    <>
      {/* Aurora background glow behind navbar */}
      <div className={`nav-aurora ${scrolled ? "visible" : ""}`} />

      <nav className={`navbar-pro ${scrolled ? "scrolled" : ""}`} ref={navRef}>
        <div className="navbar-pro-inner">
          
          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={closeAll}>
            <div className="nav-logo-ring">
              <span className="nav-logo-emoji">💅</span>
            </div>
            <span className="nav-logo-text">
              Ezer <span className="nav-logo-accent">NailArt</span>
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className={`nav-toggle ${isOpen ? "open" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            <span className="nav-toggle-line" />
            <span className="nav-toggle-line" />
            <span className="nav-toggle-line" />
          </button>

          {/* Navigation Links */}
          <div className={`nav-menu ${isOpen ? "open" : ""}`}>
            <div className="nav-menu-inner">
              {user ? (
                <>
                  <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`} onClick={closeAll}>
                    <span className="nav-item-icon">🏠</span>
                    <span className="nav-item-label">Home</span>
                    <span className="nav-item-bg" />
                  </Link>

                  <Link to="/designs" className={`nav-item ${isActive("/designs") ? "active" : ""}`} onClick={closeAll}>
                    <span className="nav-item-icon">🎨</span>
                    <span className="nav-item-label">Designs</span>
                    <span className="nav-item-bg" />
                  </Link>

                  <Link to="/booking" className={`nav-item nav-cta-btn ${isActive("/booking") ? "active" : ""}`} onClick={closeAll}>
                    <span className="nav-item-icon">✨</span>
                    <span className="nav-item-label">Book Now</span>
                    <span className="nav-cta-shimmer" />
                    <span className="nav-cta-glow" />
                  </Link>

                  <Link to="/profile" className={`nav-item ${isActive("/profile") ? "active" : ""}`} onClick={closeAll}>
                    <span className="nav-item-icon">👤</span>
                    <span className="nav-item-label">Profile</span>
                    <span className="nav-item-bg" />
                  </Link>

                  {/* Super Admin Link */}
                  {profile?.role === "super_admin" && (
                    <Link
                      to="/super-admin"
                      className={`nav-item nav-super-admin ${isActive("/super-admin") ? "active" : ""}`}
                      onClick={closeAll}
                    >
                      <span className="nav-item-icon">🛡️</span>
                      <span className="nav-item-label">Super Admin</span>
                      <span className="nav-item-bg" />
                    </Link>
                  )}

                  {/* Admin Link */}
                  {profile?.role === "admin" && (
                    <Link to="/admin" className={`nav-item nav-admin-item ${isActive("/admin") ? "active" : ""}`} onClick={closeAll}>
                      <span className="nav-item-icon">⚙️</span>
                      <span className="nav-item-label">Admin</span>
                      <span className="nav-item-bg" />
                    </Link>
                  )}

                  {/* User Dropdown */}
                  <div className="nav-dropdown">
                    <button
                      className="nav-user-btn"
                      onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                    >
                      <span className="nav-user-avatar">
                        {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                      <span className="nav-user-name">
                        {profile?.full_name?.split(" ")[0] || "User"}
                      </span>
                      <svg className={`nav-chevron ${dropdownOpen ? "open" : ""}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <div className={`nav-dropdown-panel ${dropdownOpen ? "open" : ""}`}>
                      <div className="nav-dropdown-header">
                        <span className="nav-dropdown-avatar-lg">
                          {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                        <div>
                          <p className="nav-dropdown-name">{profile?.full_name || "User"}</p>
                          <p className="nav-dropdown-email">{profile?.email || ""}</p>
                        </div>
                      </div>
                      <div className="nav-dropdown-divider" />
                      <Link to="/profile" className="nav-dropdown-link" onClick={closeAll}>
                        <span>👤</span> My Profile
                      </Link>
                      {profile?.role === "admin" && (
                        <Link to="/admin" className="nav-dropdown-link" onClick={closeAll}>
                          <span>⚙️</span> Admin Dashboard
                        </Link>
                      )}
                      {profile?.role === "super_admin" && (
                        <Link to="/super-admin" className="nav-dropdown-link" onClick={closeAll}>
                          <span>🛡️</span> Super Admin
                        </Link>
                      )}
                      <div className="nav-dropdown-divider" />
                      <button className="nav-dropdown-link nav-dropdown-logout" onClick={handleLogout}>
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`} onClick={closeAll}>
                    <span className="nav-item-icon">🏠</span>
                    <span className="nav-item-label">Home</span>
                    <span className="nav-item-bg" />
                  </Link>
                  <Link to="/login" className="nav-btn nav-btn-ghost" onClick={closeAll}>
                    Sign In
                  </Link>
                  <Link to="/register" className="nav-btn nav-btn-solid" onClick={closeAll}>
                    Get Started ✨
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile overlay */}
          {isOpen && <div className="nav-overlay" onClick={closeAll} />}
        </div>
      </nav>
    </>
  );
}