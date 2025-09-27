import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavBar from '../Navbar/NavBar';
import { API_ENDPOINTS } from '../../config/api';
import img from '../../assets/doc3.jpg';
import './SignUp.css';


export default function SignUp() {
  const [type, setType] = useState("patient");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    age: 0,
    sex: "",
  });

  const [doctor, setDoctor] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    regno: "",
    qualification: "",
    specialisation: "",
    experience: 0,
    fees: 0,
    timeslot_start: 6,
    timeslot_end: 7,
    location: "",
  });

  const handlechangePatient = (e) => {
    setPatient((pat) => {
      if (e.target.name !== "age")
        return { ...pat, [e.target.name]: e.target.value };
      else return { ...pat, [e.target.name]: parseInt(e.target.value) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let data = {};
      if (type === "patient") {
        if (patient.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        data = { ...patient, type };
        console.log("Patient data ", data);
      } else {
        if (doctor.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        if (doctor.timeslot_start >= doctor.timeslot_end) {
          toast.error('Start time must be before end time');
          setIsLoading(false);
          return;
        }
        data = { ...doctor, type };
      }

      const res = await axios.post(API_ENDPOINTS.REGISTER, data);

      if (res.data.status) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlechangeDoctor = (e) => {
    setDoctor((doc) => {
      if (
        e.target.name !== "age" &&
        e.target.name !== "experience" &&
        e.target.name !== "fees"
      )
        return { ...doc, [e.target.name]: e.target.value };
      else return { ...doc, [e.target.name]: parseInt(e.target.value) };
    });
  };

  const specializations = [
    'Cardiologist', 'Neurologist', 'Dermatologist', 'Pediatrician', 
    'Orthopedic', 'Psychiatrist', 'Gynecologist', 'ENT Specialist',
    'Ophthalmologist', 'Urologist', 'Gastroenterologist', 'Pulmonologist'
  ];

  return (
    <div className='signup-page'>
      <NavBar />
      <div className="signup-container">
        <div className="signup-card card-modern">
          <div className="signup-content">
            {/* Left Side - Image */}
            <div className="signup-image-section slide-right">
              <div className="image-container">
                <img src={img} alt="Healthcare Professional" className="signup-image" />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <div className="welcome-badge">
                      <span className="badge-icon">🌟</span>
                      <span>Welcome to Healthcare Excellence</span>
                    </div>
                    <h3>Join Our Healthcare Network</h3>
                    <p>Connect with thousands of healthcare professionals and patients in a secure, professional environment</p>
                    
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-number">10K+</div>
                        <div className="stat-label">Doctors</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-number">50K+</div>
                        <div className="stat-label">Patients</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Support</div>
                      </div>
                    </div>

                    <div className="feature-list">
                      <div className="feature-item">
                        <span className="feature-icon">🏥</span>
                        <span>Professional Network</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">⚡</span>
                        <span>Instant Appointments</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">🔒</span>
                        <span>Secure & Private</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">📱</span>
                        <span>Mobile Friendly</span>
                      </div>
                    </div>

                    <div className="trust-indicators">
                      <div className="trust-item">
                        <span className="trust-icon">🛡️</span>
                        <span>HIPAA Compliant</span>
                      </div>
                      <div className="trust-item">
                        <span className="trust-icon">✅</span>
                        <span>Verified Doctors</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="signup-form-section">
              <div className="signup-header">
                <div className="signup-icon">
                  {type === 'doctor' ? '👨‍⚕️' : '👤'}
                </div>
                <h1 className="signup-title slide-up">
                  Create Account
                </h1>
                <p className="signup-subtitle slide-up">
                  Join as a {type}
                </p>
              </div>

              <form className='signup-form form-modern' onSubmit={handleSubmit}>
                {/* User Type Selection */}
                <div className="input-group slide-up">
                  <label className="label-modern">Account Type</label>
                  <div className="type-selector">
                    <button
                      type="button"
                      className={`type-btn ${type === 'patient' ? 'active' : ''}`}
                      onClick={() => setType('patient')}
                    >
                      <span className="type-icon">👤</span>
                      Patient
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${type === 'doctor' ? 'active' : ''}`}
                      onClick={() => setType('doctor')}
                    >
                      <span className="type-icon">👨‍⚕️</span>
                      Doctor
                    </button>
                  </div>
                </div>

                {type === "patient" ? (
                  // Patient Form Fields
                  <>
                    <div className="form-row">
                      <div className="input-group slide-up">
                        <label className="label-modern">Full Name</label>
                        <div className="input-wrapper">
                          <span className="input-icon">👤</span>
                          <input 
                            type="text" 
                            className='input-modern' 
                            required 
                            placeholder='Enter your full name' 
                            name='name' 
                            onChange={handlechangePatient} 
                            value={patient.name}
                          />
                        </div>
                      </div>
                      
                      <div className="input-group slide-up">
                        <label className="label-modern">Email Address</label>
                        <div className="input-wrapper">
                          <span className="input-icon">📧</span>
                          <input 
                            type="email" 
                            className='input-modern' 
                            required 
                            placeholder='Enter your email' 
                            name='email' 
                            onChange={handlechangePatient} 
                            value={patient.email}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="input-group slide-up">
                        <label className="label-modern">Age</label>
                        <div className="input-wrapper">
                          <span className="input-icon">🎂</span>
                          <input 
                            type="number" 
                            className='input-modern' 
                            required 
                            placeholder='Your age' 
                            name='age' 
                            min="1"
                            max="120"
                            onChange={handlechangePatient} 
                            value={patient.age || ''}
                          />
                        </div>
                      </div>

                      <div className="input-group slide-up">
                        <label className="label-modern">Gender (Optional)</label>
                        <div className="input-wrapper">
                          <span className="input-icon">⚧</span>
                          <select 
                            className='input-modern' 
                            name='sex' 
                            onChange={handlechangePatient} 
                            value={patient.sex}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="input-group slide-up">
                      <label className="label-modern">Password</label>
                      <div className="input-wrapper">
                        <span className="input-icon">🔒</span>
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          className='input-modern' 
                          required 
                          placeholder='Create a password' 
                          name='password' 
                          onChange={handlechangePatient} 
                          value={patient.password}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // Doctor Form Fields  
                  <>
                    <div className="form-row">
                      <div className="input-group slide-up">
                        <label className="label-modern">Full Name</label>
                        <div className="input-wrapper">
                          <span className="input-icon">👨‍⚕️</span>
                          <input 
                            type="text" 
                            className='input-modern' 
                            required 
                            placeholder='Dr. Your Name' 
                            name='name' 
                            onChange={handlechangeDoctor} 
                            value={doctor.name}
                          />
                        </div>
                      </div>
                      
                      <div className="input-group slide-up">
                        <label className="label-modern">Email Address</label>
                        <div className="input-wrapper">
                          <span className="input-icon">📧</span>
                          <input 
                            type="email" 
                            className='input-modern' 
                            required 
                            placeholder='doctor@hospital.com' 
                            name='email' 
                            onChange={handlechangeDoctor} 
                            value={doctor.email}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="input-group slide-up">
                        <label className="label-modern">Registration Number</label>
                        <div className="input-wrapper">
                          <span className="input-icon">🆔</span>
                          <input 
                            type="text" 
                            className='input-modern' 
                            required 
                            placeholder='Medical Registration No.' 
                            name='regno' 
                            onChange={handlechangeDoctor} 
                            value={doctor.regno}
                          />
                        </div>
                      </div>

                      <div className="input-group slide-up">
                        <label className="label-modern">Qualification</label>
                        <div className="input-wrapper">
                          <span className="input-icon">🎓</span>
                          <input 
                            type="text" 
                            className='input-modern' 
                            required 
                            placeholder='MBBS, MD, etc.' 
                            name='qualification' 
                            onChange={handlechangeDoctor} 
                            value={doctor.qualification}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="input-group slide-up">
                        <label className="label-modern">Specialization</label>
                        <div className="input-wrapper">
                          <span className="input-icon">🩺</span>
                          <select 
                            className='input-modern' 
                            required 
                            name='specialisation' 
                            onChange={handlechangeDoctor} 
                            value={doctor.specialisation}
                          >
                            <option value="">Select Specialization</option>
                            {specializations.map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="input-group slide-up">
                        <label className="label-modern">Experience (Years)</label>
                        <div className="input-wrapper">
                          <span className="input-icon">⏳</span>
                          <input 
                            type="number" 
                            className='input-modern' 
                            required 
                            placeholder='Years of experience' 
                            name='experience' 
                            min="0"
                            max="50"
                            onChange={handlechangeDoctor} 
                            value={doctor.experience || ''}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="input-group slide-up">
                        <label className="label-modern">Consultation Fee (₹)</label>
                        <div className="input-wrapper">
                          <span className="input-icon">💰</span>
                          <input 
                            type="number" 
                            className='input-modern' 
                            required 
                            placeholder='Consultation fee' 
                            name='fees' 
                            min="0"
                            onChange={handlechangeDoctor} 
                            value={doctor.fees || ''}
                          />
                        </div>
                      </div>

                      <div className="input-group slide-up">
                        <label className="label-modern">Location</label>
                        <div className="input-wrapper">
                          <span className="input-icon">📍</span>
                          <input 
                            type="text" 
                            className='input-modern' 
                            required 
                            placeholder='City, Hospital' 
                            name='location' 
                            onChange={handlechangeDoctor} 
                            value={doctor.location}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="input-group slide-up">
                        <label className="label-modern">Available From</label>
                        <div className="input-wrapper">
                          <span className="input-icon">🕐</span>
                          <select 
                            className='input-modern' 
                            required 
                            name='timeslot_start' 
                            onChange={handlechangeDoctor} 
                            value={doctor.timeslot_start}
                          >
                            {Array.from({length: 24}, (_, i) => (
                              <option key={i} value={i}>{i}:00</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="input-group slide-up">
                        <label className="label-modern">Available Until</label>
                        <div className="input-wrapper">
                          <span className="input-icon">🕐</span>
                          <select 
                            className='input-modern' 
                            required 
                            name='timeslot_end' 
                            onChange={handlechangeDoctor} 
                            value={doctor.timeslot_end}
                          >
                            {Array.from({length: 24}, (_, i) => (
                              <option key={i} value={i}>{i}:00</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="input-group slide-up">
                      <label className="label-modern">Password</label>
                      <div className="input-wrapper">
                        <span className="input-icon">🔒</span>
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          className='input-modern' 
                          required 
                          placeholder='Create a secure password' 
                          name='password' 
                          onChange={handlechangeDoctor} 
                          value={doctor.password}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div className="submit-section slide-up">
                  <button 
                    type="submit" 
                    className="btn-modern btn-primary signup-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        Create Account
                      </>
                    )}
                  </button>
                </div>

                {/* Link to Login */}
                <div className="auth-link slide-up">
                  <p>Already have an account?</p>
                  <Link to='/login' className="link-modern">
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
