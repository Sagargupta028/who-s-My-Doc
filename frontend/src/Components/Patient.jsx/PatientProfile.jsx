import React, { useContext, useEffect, useState } from 'react';
import './PatientProfile.css';
import NavBar from '../Navbar/NavBar';
import { AuthContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingRecordsCard from './BookingRecorCard';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';

const PatientProfile = () => {
    const { isAuthenticated, login, logout } = useContext(AuthContext);
    const [previousRecords, setPreviousRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const navigate = useNavigate();

    const getAllRecords = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post(API_ENDPOINTS.PATIENT.PREVIOUS_RECORDS, {
                'email': isAuthenticated[1]?.email
            })
            setPreviousRecords(res.data);
        } catch (error) {
            console.log("Error in fetching records");
        } finally {
            setIsLoading(false);
        }
    };


    const handleCancel = async (appointmentRecord, doctorEmail, appointmentDate) => {
        try {
            // Debug: Log all parameters received
            console.log('handleCancel called with:', {
                appointmentRecord,
                doctorEmail,
                appointmentDate,
                'appointmentRecord.doctor': appointmentRecord?.doctor,
                'appointmentRecord.doctor.email': appointmentRecord?.doctor?.email
            });

            // Show confirmation dialog
            const confirmCancel = window.confirm(
                `Are you sure you want to cancel your appointment on ${new Date(appointmentDate).toLocaleDateString()}? This action cannot be undone.`
            );
            
            if (!confirmCancel) return;

            // Use doctor email from appointmentRecord if doctorEmail is undefined
            const finalDoctorEmail = doctorEmail || appointmentRecord?.doctor?.email;

            // Debug: Log the data being sent
            const requestData = {
                patient_email: isAuthenticated[1]?.email,
                doctor_email: finalDoctorEmail,
                date_of_appointment: appointmentDate
            };
            
            console.log('Sending cancel request with data:', requestData);

            // Validate required fields before making API call
            if (!requestData.patient_email || !requestData.doctor_email || !requestData.date_of_appointment) {
                toast.error('Missing required information. Please try again.');
                console.error('Missing required fields:', requestData);
                return;
            }

            // Make API call to cancel appointment
            const response = await axios.post(API_ENDPOINTS.PATIENT.CANCEL_APPOINTMENT, requestData);

            if (response.data.success) {
                toast.success('Appointment cancelled successfully!');
                // Refresh the records to show updated status
                getAllRecords();
            } else {
                toast.error('Failed to cancel appointment. Please try again.');
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            console.error('Error response:', error.response?.data);
            toast.error(`Failed to cancel appointment: ${error.response?.data?.message || error.message}`);
        }
    };

    useEffect(() => {
        if (isAuthenticated[1]?.email) {
            getAllRecords();
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (isAuthenticated[0] === false)
            navigate('/login')
    }, [isAuthenticated])

    const getFilteredAndSortedRecords = () => {
        let filtered = [...previousRecords];
        
        // Apply filters
        if (filter !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            filtered = filtered.filter(rec => {
                const appointmentDate = new Date(rec.date_of_appointment);
                const appointmentDay = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
                
                switch (filter) {
                    case 'upcoming':
                        return appointmentDay >= today;
                    case 'past':
                        return appointmentDay < today;
                    case 'thisMonth':
                        return appointmentDate.getMonth() === now.getMonth() && appointmentDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.date_of_appointment) - new Date(a.date_of_appointment);
                case 'doctor':
                    return a.doctor.name.localeCompare(b.doctor.name);
                case 'specialization':
                    return a.doctor.specialisation.localeCompare(b.doctor.specialisation);
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const filteredRecords = getFilteredAndSortedRecords();

    if (isLoading) {
        return (
            <>
                <NavBar />
                <div className="records-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your appointment history...</p>
                </div>
            </>
        );
    }

    return (
        <div className="records-page">
            <NavBar />
            
            {/* Hero Section */}
            <div className="records-hero">
                <div className="hero-content">
                    <div className="hero-text fade-in">
                        <h1 className="hero-title">
                            My <span className="gradient-text">Appointments</span>
                        </h1>
                        <p className="hero-description">
                            View and manage your appointment history with healthcare professionals
                        </p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">{previousRecords.length}</div>
                                <div className="stat-label">Total Appointments</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">{new Set(previousRecords.map(r => r.doctor.email)).size}</div>
                                <div className="stat-label">Doctors Consulted</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">{new Set(previousRecords.map(r => r.doctor.specialisation)).size}</div>
                                <div className="stat-label">Specializations</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Records Content */}
            <div className="records-container">
                {previousRecords.length > 0 ? (
                    <>
                        {/* Filters and Controls */}
                        <div className="records-controls card-modern">
                            <div className="controls-header">
                                <h3 className="controls-title">
                                    <span className="controls-icon">🔍</span>
                                    Filter & Sort
                                </h3>
                                <div className="results-count">
                                    {filteredRecords.length} of {previousRecords.length} appointments
                                </div>
                            </div>
                            
                            <div className="controls-grid">
                                <div className="control-group">
                                    <label className="control-label">
                                        <span className="label-icon">📅</span>
                                        Filter by Date
                                    </label>
                                    <select 
                                        className="control-select"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <option value="all">All Appointments</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="past">Past Appointments</option>
                                        <option value="thisMonth">This Month</option>
                                    </select>
                                </div>

                                <div className="control-group">
                                    <label className="control-label">
                                        <span className="label-icon">🔄</span>
                                        Sort by
                                    </label>
                                    <select 
                                        className="control-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="date">Date (Newest First)</option>
                                        <option value="doctor">Doctor Name</option>
                                        <option value="specialization">Specialization</option>
                                    </select>
                                </div>

                                <div className="control-group">
                                    <button 
                                        className="btn-modern btn-primary"
                                        onClick={() => navigate('/patient')}
                                    >
                                        <span className="btn-icon">➕</span>
                                        Book New Appointment
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Records List */}
                        <div className="records-list">
                            <div className="records-header">
                                <h2 className="records-title">
                                    <span className="records-icon">📋</span>
                                    Appointment History
                                </h2>
                            </div>

                            <div className="records-grid">
                                {filteredRecords.map((rec, index) => (
                                    <BookingRecordsCard 
                                        key={`${rec.doctor.email}-${rec.date_of_appointment}-${index}`}
                                        rec={rec} 
                                        index={index}
                                        onCancel={handleCancel}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-content">
                            <div className="empty-icon">📅</div>
                            <h3 className="empty-title">No Appointment History</h3>
                            <p className="empty-description">
                                You haven't booked any appointments yet. Start by finding a doctor that suits your needs.
                            </p>
                            <div className="empty-actions">
                                <button 
                                    className="btn-modern btn-primary"
                                    onClick={() => navigate("/patient")}
                                >
                                    <span className="btn-icon">🔍</span>
                                    Find Your Doctor
                                </button>
                                <button 
                                    className="btn-modern btn-outline"
                                    onClick={() => navigate("/predict-doctor")}
                                >
                                    <span className="btn-icon">🩺</span>
                                    Symptom Checker
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PatientProfile