import React, { useContext, useState, useEffect } from 'react'
import './Login.css'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthProvider';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';
import NavBar from '../Navbar/NavBar';
import img2 from '../../assets/prof-user.jpg';

export default function Login() {
    const [type, setType] = useState('doctor')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: '',
        password: '',
    })

    const { isAuthenticated, login } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const formData = { ...user, type };
            console.log("Form data", formData);
            const res = await axios.post(API_ENDPOINTS.LOGIN, formData);
            console.log("Logged in response : ", res.data);

            if (res.data.status) {
                const { token, user: userData } = res.data
                login(userData)
                localStorage.setItem('whosmydoc', token);
                toast.success(`Welcome ${userData.name}!`);
                
                // Navigation will be handled by useEffect
            }
            else {
                toast.error(res.data.message || 'Login failed');
            }

        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const handletype = (e) => {
        setType(e.target.value)
    }

    const handlechangeUser = (e) => {
        setUser((us) => {
            return { ...us, [e.target.name]: e.target.value }
        })
    }

    useEffect(() => {
        if (isAuthenticated[0] && isAuthenticated[1]) {
            // Redirect all users to home page after login
            navigate('/');
        }
    }, [isAuthenticated, navigate])

    return (
        <div className='login-page'>
            <NavBar />
            <div className="login-container">
                <div className="login-card card-modern">
                    <div className="login-content">
                        {/* Left Side - Form */}
                        <div className="login-form-section">
                            <div className="login-header">
                                <div className="login-icon">
                                    {type === 'doctor' ? '👨‍⚕️' : '👤'}
                                </div>
                                <h1 className="login-title slide-up">
                                    Welcome Back
                                </h1>
                                <p className="login-subtitle slide-up">
                                    Sign in to your {type} account
                                </p>
                            </div>

                            <form className='login-form form-modern' onSubmit={handleSubmit}>
                                {/* User Type Selection */}
                                <div className="input-group slide-up">
                                    <label className="label-modern">Account Type</label>
                                    <div className="type-selector">
                                        <button
                                            type="button"
                                            className={`type-btn ${type === 'doctor' ? 'active' : ''}`}
                                            onClick={() => setType('doctor')}
                                        >
                                            <span className="type-icon">👨‍⚕️</span>
                                            Doctor
                                        </button>
                                        <button
                                            type="button"
                                            className={`type-btn ${type === 'patient' ? 'active' : ''}`}
                                            onClick={() => setType('patient')}
                                        >
                                            <span className="type-icon">👤</span>
                                            Patient
                                        </button>
                                    </div>
                                </div>

                                {/* Email Input */}
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
                                            onChange={handlechangeUser} 
                                            value={user.email}
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="input-group slide-up">
                                    <label className="label-modern">Password</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">🔒</span>
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            className='input-modern' 
                                            required 
                                            placeholder='Enter your password' 
                                            name='password' 
                                            onChange={handlechangeUser} 
                                            value={user.password}
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

                                {/* Submit Button */}
                                <div className="submit-section slide-up">
                                    <button 
                                        type="submit" 
                                        className="btn-modern btn-primary login-btn"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="spinner"></div>
                                                Signing In...
                                            </>
                                        ) : (
                                            <>
                                                <span>🚀</span>
                                                Sign In
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Link to Signup */}
                                <div className="auth-link slide-up">
                                    <p>Don't have an account?</p>
                                    <Link to='/signup' className="link-modern">
                                        Create Account
                                    </Link>
                                </div>
                            </form>
                        </div>

                        {/* Right Side - Image */}
                        <div className="login-image-section slide-left">
                            <div className="image-container">
                                <img src={img2} alt="Healthcare Professional" className="login-image" />
                                <div className="image-overlay">
                                    <div className="overlay-content">
                                        <h3>Join Our Healthcare Community</h3>
                                        <p>Connect with patients and doctors in a secure, professional environment</p>
                                        <div className="feature-list">
                                            <div className="feature-item">
                                                <span className="feature-icon">⚡</span>
                                                <span>Instant Appointments</span>
                                            </div>
                                            <div className="feature-item">
                                                <span className="feature-icon">🔒</span>
                                                <span>Secure Platform</span>
                                            </div>
                                            <div className="feature-item">
                                                <span className="feature-icon">📱</span>
                                                <span>Mobile Friendly</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
