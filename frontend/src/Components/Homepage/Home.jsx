import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import img05 from "../../assets/doc5.jpg";
import { useNavigate } from "react-router-dom";
import NavBar from "../Navbar/NavBar";
import { AuthContext } from "../../context/AuthProvider";
import Footer from "../Footer/Footer";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const isPatientOrGuest = !isAuthenticated[0] || isAuthenticated[1]?.type === 'patient';
  const userName = isAuthenticated[0] ? isAuthenticated[1]?.name : '';

  return (
    <div className="home-container">
      <NavBar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className={`hero-text ${isVisible ? 'fade-in' : ''}`}>
            <div className="hero-badge slide-up">
              <span className="badge-icon">🏥</span>
              <span>Healthcare Excellence</span>
            </div>
            
            <h1 className="hero-title slide-up">
              {isPatientOrGuest ? (
                <>
                  Your Health, <br />
                  <span className="gradient-text">Our Priority</span>
                </>
              ) : (
                <>
                  Welcome Back, <br />
                  <span className="gradient-text">Dr. {userName}</span>
                </>
              )}
            </h1>

            <p className="hero-description slide-up">
              {isPatientOrGuest ? (
                "Connect with qualified healthcare professionals instantly. Find the right doctor for your needs with our intelligent symptom-based recommendation system."
              ) : (
                "Manage your appointments, view patient records, and provide quality healthcare through our comprehensive platform."
              )}
            </p>

            <div className="hero-actions slide-up">
              <button 
                className="btn-modern btn-primary hero-btn"
                onClick={() => isPatientOrGuest ? navigate("/patient") : navigate("/doctor-booking-history")}
              >
                <span className="btn-icon">
                  {isPatientOrGuest ? "🔍" : "👥"}
                </span>
                {isPatientOrGuest ? "Find Your Doctor" : "View Your Patients"}
              </button>
              
              {isPatientOrGuest && (
                <button 
                  className="btn-modern btn-outline hero-btn"
                  onClick={() => navigate("/predict-doctor")}
                >
                  <span className="btn-icon">🩺</span>
                  Symptom Checker
                </button>
              )}
            </div>

            <div className="hero-stats slide-up">
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Doctors</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50k+</div>
                <div className="stat-label">Patients</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>

          <div className={`hero-image ${isVisible ? 'slide-left' : ''}`}>
            <div className="image-wrapper">
              <img src={img05} alt="Healthcare Professional" className="main-image float" />
              <div className="image-decoration decoration-1"></div>
              <div className="image-decoration decoration-2"></div>
              <div className="floating-card card-1">
                <div className="card-icon">💊</div>
                <div className="card-text">Smart Diagnosis</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">⚡</div>
                <div className="card-text">Quick Booking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header fade-in">
            <h2 className="section-title">Why Choose Us?</h2>
            <p className="section-subtitle">
              Experience healthcare like never before with our innovative platform
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card scale-in">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Smart Matching</h3>
              <p className="feature-description">
                Our AI-powered system matches you with the most suitable doctors based on your symptoms and preferences.
              </p>
            </div>

            <div className="feature-card scale-in">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Instant Booking</h3>
              <p className="feature-description">
                Book appointments instantly with real-time availability and get confirmation within minutes.
              </p>
            </div>

            <div className="feature-card scale-in">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your medical data is protected with enterprise-grade security and complete privacy compliance.
              </p>
            </div>

            <div className="feature-card scale-in">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Mobile Ready</h3>
              <p className="feature-description">
                Access your healthcare anywhere, anytime with our fully responsive mobile-optimized platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;