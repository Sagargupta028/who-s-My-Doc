
// PatientProfile.jsx

import React, { useContext, useEffect, useState } from 'react';
import './ProfilePatient.css';
import img2 from '../../assets/prof-user.jpg';
import { AuthContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Navbar/NavBar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';

export default function ProfilePatient() {
    const { isAuthenticated, login } = useContext(AuthContext);
    const originalPatient = isAuthenticated[0] && isAuthenticated[1];
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [patient, setPatient] = useState(originalPatient);

    useEffect(() => {
        if (originalPatient && originalPatient.type === 'doctor')
            navigate('/');
        if (originalPatient && !patient) {
            setPatient(originalPatient);
            setEditedPatient(originalPatient);
        }
    }, [originalPatient, navigate, patient]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        // Basic validation
        if (!editedPatient.name || !editedPatient.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!editedPatient.age || editedPatient.age < 1 || editedPatient.age > 120) {
            toast.error('Please enter a valid age between 1 and 120');
            return;
        }

        setIsSaving(true);
        try {
            // Make API call to update patient data
            const response = await axios.put(API_ENDPOINTS.PATIENT.UPDATE_PROFILE, {
                email: patient.email,
                name: editedPatient.name.trim(),
                age: parseInt(editedPatient.age),
                sex: editedPatient.sex,
                username: editedPatient.username
            });

            if (response.data.success) {
                // Update the local patient state with the response data from backend
                const updatedPatient = { 
                    ...patient, 
                    ...response.data.patient,
                    type: patient.type // Preserve the user type
                };
                
                // Update local state
                setPatient(updatedPatient);
                setEditedPatient(updatedPatient);
                setIsEditing(false);
                
                // Update context in background without causing re-render issues
                login(true, updatedPatient);
                
                toast.success('Profile updated successfully!');
            } else {
                toast.error(response.data.message || 'Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Error updating profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setEditedPatient(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!patient && !originalPatient) {
        return (
            <>
                <NavBar />
                <div className="profile-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </>
        );
    }

    // Use patient if available, otherwise fallback to originalPatient
    const displayPatient = patient || originalPatient;

    return (
        <>
            <NavBar />
            <div className="profile-page">
                {/* Hero Section */}
                <div className="profile-hero">
                    <div className="hero-content">
                        <div className="hero-text fade-in">
                            <h1 className="hero-title">
                                My <span className="gradient-text">Profile</span>
                            </h1>
                            <p className="hero-description">
                                Welcome back, {displayPatient.name}! Manage your profile and health information.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Profile Content */}
                <div className="profile-container">
                    <div className="profile-grid">
                        {/* Profile Card */}
                        <div className="profile-card card-modern slide-up">
                            <div className="profile-header">
                                <div className="avatar-section">
                                    <div className="avatar-wrapper">
                                        <img src={img2} alt="Profile" className="profile-avatar" />
                                        <div className="avatar-badge">
                                            <span className="badge-icon">👤</span>
                                        </div>
                                    </div>
                                    <div className="profile-info">
                                        <h2 className="profile-name">{displayPatient.name}</h2>
                                        <p className="profile-type">Patient</p>
                                        <div className="profile-status">
                                            <span className="status-indicator active"></span>
                                            <span className="status-text">Active</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="profile-actions">
                                    <button 
                                        className={`btn-modern ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                                        onClick={handleEdit}
                                    >
                                        <span className="btn-icon">{isEditing ? '✖️' : '✏️'}</span>
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                    {isEditing && (
                                        <button 
                                            className="btn-modern btn-primary"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                        >
                                            <span className="btn-icon">{isSaving ? '⏳' : '💾'}</span>
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="profile-details">
                                <div className="details-section">
                                    <h3 className="section-title">
                                        <span className="section-icon">📋</span>
                                        Personal Information
                                    </h3>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <label className="detail-label">
                                                <span className="label-icon">👤</span>
                                                Full Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="input-modern"
                                                    value={editedPatient.name || ''}
                                                    onChange={(e) => handleChange('name', e.target.value)}
                                                />
                                            ) : (
                                                <span className="detail-value">{displayPatient.name}</span>
                                            )}
                                        </div>

                                        <div className="detail-item">
                                            <label className="detail-label">
                                                <span className="label-icon">📧</span>
                                                Email Address
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    className="input-modern"
                                                    value={editedPatient.email || ''}
                                                    onChange={(e) => handleChange('email', e.target.value)}
                                                />
                                            ) : (
                                                <span className="detail-value">{displayPatient.email}</span>
                                            )}
                                        </div>

                                        {/* <div className="detail-item">
                                            <label className="detail-label">
                                                <span className="label-icon">🆔</span>
                                                Username
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="input-modern"
                                                    value={editedPatient.username || ''}
                                                    onChange={(e) => handleChange('username', e.target.value)}
                                                />
                                            ) : (
                                                <span className="detail-value">{displayPatient.username}</span>
                                            )}
                                        </div> */}

                                        <div className="detail-item">
                                            <label className="detail-label">
                                                <span className="label-icon">🎂</span>
                                                Age
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    className="input-modern"
                                                    value={editedPatient.age || ''}
                                                    onChange={(e) => handleChange('age', e.target.value)}
                                                />
                                            ) : (
                                                <span className="detail-value">{displayPatient.age} years</span>
                                            )}
                                        </div>

                                        <div className="detail-item">
                                            <label className="detail-label">
                                                <span className="label-icon">⚧</span>
                                                Gender
                                            </label>
                                            {isEditing ? (
                                                <select
                                                    className="input-modern"
                                                    value={editedPatient.sex || ''}
                                                    onChange={(e) => handleChange('sex', e.target.value)}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            ) : (
                                                <span className="detail-value">
                                                    {displayPatient.sex === '' ? 'Not specified' : 
                                                     displayPatient.sex.charAt(0).toUpperCase() + displayPatient.sex.slice(1)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="detail-item">
                                            <label className="detail-label">
                                                <span className="label-icon">📅</span>
                                                Member Since
                                            </label>
                                            <span className="detail-value">January 2024</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="actions-card card-modern slide-up" style={{ animationDelay: '0.2s' }}>
                            <h3 className="card-title">
                                <span className="title-icon">⚡</span>
                                Quick Actions
                            </h3>
                            <div className="actions-grid">
                                <button className="action-btn" onClick={() => navigate('/patient')}>
                                    <div className="action-icon">🔍</div>
                                    <div className="action-content">
                                        <h4>Find Doctors</h4>
                                        <p>Search and book appointments</p>
                                    </div>
                                </button>
                                
                                <button className="action-btn" onClick={() => navigate('/predict-doctor')}>
                                    <div className="action-icon">🩺</div>
                                    <div className="action-content">
                                        <h4>Symptom Checker</h4>
                                        <p>Get doctor recommendations</p>
                                    </div>
                                </button>
                                
                                <button className="action-btn" onClick={() => navigate('/patient-profile')}>
                                    <div className="action-icon">📋</div>
                                    <div className="action-content">
                                        <h4>My Appointments</h4>
                                        <p>View booking history</p>
                                    </div>
                                </button>
                                
                                <button className="action-btn" onClick={() => setIsEditing(!isEditing)}>
                                    <div className="action-icon">⚙️</div>
                                    <div className="action-content">
                                        <h4>Settings</h4>
                                        <p>Account preferences</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="stats-card card-modern slide-up" style={{ animationDelay: '0.4s' }}>
                            <h3 className="card-title">
                                <span className="title-icon">📊</span>
                                Health Summary
                            </h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-icon">📅</div>
                                    <div className="stat-content">
                                        <div className="stat-number">5</div>
                                        <div className="stat-label">Total Appointments</div>
                                    </div>
                                </div>
                                
                                <div className="stat-item">
                                    <div className="stat-icon">👨‍⚕️</div>
                                    <div className="stat-content">
                                        <div className="stat-number">3</div>
                                        <div className="stat-label">Doctors Consulted</div>
                                    </div>
                                </div>
                                
                                <div className="stat-item">
                                    <div className="stat-icon">🏥</div>
                                    <div className="stat-content">
                                        <div className="stat-number">2</div>
                                        <div className="stat-label">Upcoming Visits</div>
                                    </div>
                                </div>
                                
                                <div className="stat-item">
                                    <div className="stat-icon">⭐</div>
                                    <div className="stat-content">
                                        <div className="stat-number">4.8</div>
                                        <div className="stat-label">Avg. Rating Given</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

