import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import "./NavBar.css";
import logo1black from "../../assets/logo1black.png";

export default function NavBar() {
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const type = isAuthenticated[0] && isAuthenticated[1].type;

  const handlelogout = () => {
    logout();
    localStorage.removeItem("whosmydoc");
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = isAuthenticated[0] ? [
    {
      label: isAuthenticated[1].type === "patient" ? "Book Doctor" : "Booking Log",
      path: isAuthenticated[1].type === "patient" ? "/patient" : "/doctor",
      icon: "🏥"
    },
    {
      label: "Previous Records",
      path: isAuthenticated[1].type === "patient" ? "/patient-profile" : "/doctor-booking-history",
      icon: "📋"
    },
    {
      label: "Predict Doctor",
      path: "/predict-doctor",
      icon: "🔍"
    }
  ] : [];

  return (
    <nav className={`modern-navbar ${isScrolled ? 'scrolled' : ''} slide-down`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img
            src={logo1black}
            alt="Who's My Doc"
            className="logo-image"
          />
          <span className="logo-text">Who's My Doc</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop-menu">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="nav-link"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Info & Auth */}
        <div className="navbar-actions">
          {isAuthenticated[0] && (
            <Link 
              to={type === "doctor" ? "/doctor-user-prof" : "/patient-user-prof"} 
              className="user-info user-info-link"
            >
              <span className="user-avatar">
                {isAuthenticated[1]?.name?.charAt(0).toUpperCase()}
              </span>
              <span className="user-name">{isAuthenticated[1]?.name}</span>
            </Link>
          )}
          
          {isAuthenticated[0] ? (
            <button className="btn-modern btn-outline logout-btn" onClick={handlelogout}>
              <span>🚪</span>
              Logout
            </button>
          ) : (
            <button
              className="btn-modern btn-primary"
              onClick={() => navigate("/login")}
            >
              <span>🔐</span>
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          
          {isAuthenticated[0] && (
            <Link 
              to={type === "doctor" ? "/doctor-user-prof" : "/patient-user-prof"}
              className="mobile-user-info mobile-user-info-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="user-avatar">
                {isAuthenticated[1]?.name?.charAt(0).toUpperCase()}
              </span>
              <span className="user-name">{isAuthenticated[1]?.name}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
