import React, { useContext, useEffect, useState } from 'react';
import './DoctorBookingRecords.css';
import NavBar from '../Navbar/NavBar';
import { AuthContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import PatientRecordCard from './PatientRecordCard';


function DoctorBookingRecords() {
    const { isAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (isAuthenticated[0] === false) {
            console.log("Auth", isAuthenticated);
        }
        else {
            // getAllRecords();
            console.log("autho");
        }
    }, [isAuthenticated])

    const [previousRecords, setPreviousRecords] = useState([]);

    const getAllRecords = async () => {
        try {
            console.log(isAuthenticated[1]?.email);
            const res = await axios.post(`${API_BASE_URL}/doctor/booking-history`, {
                'doctor_email': isAuthenticated[1]?.email  //for checking
            })
            // console.log(res.data);
            setPreviousRecords(res.data);

        } catch (error) {
            console.log("Error in fetching records");
        }
    }

    useEffect(() => {
        getAllRecords();
    }, [])


    // useEffect(() => {
    //     if (isAuthenticated[0] === false || isAuthenticated[1].type !== 'doctor') {
    //         console.log("Auth", isAuthenticated);
    //     }
    //     // navigate('/login')
    // }, [isAuthenticated])

    useEffect(() => {
        console.log(previousRecords);
    }, [previousRecords])

    return (
        <div className="doctor-booking-records">
            <NavBar />
            
            <div className="records-container">
                {/* Hero Section */}
                <div className="records-hero">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1>Patient Booking History</h1>
                            <p>View and manage all your patient appointments</p>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <div className="stat-number">{previousRecords.length}</div>
                                    <div className="stat-label">Total Bookings</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{previousRecords.filter(rec => new Date(rec.date_of_appointment) >= new Date()).length}</div>
                                    <div className="stat-label">Upcoming</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{new Set(previousRecords.map(r => r.patient_email)).size}</div>
                                    <div className="stat-label">Unique Patients</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Records Section */}
                {previousRecords.length > 0 ? (
                    <div className="records-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="section-icon">📋</span>
                                Appointment History
                            </h2>
                        </div>
                        
                        <div className="records-grid">
                            {previousRecords.map((rec, index) => (
                                <PatientRecordCard 
                                    key={`${rec.patient_email}-${rec.date_of_appointment}-${index}`}
                                    rec={rec} 
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-content">
                            <div className="empty-icon">📅</div>
                            <h3 className="empty-title">No Booking History</h3>
                            <p className="empty-description">
                                You haven't received any patient bookings yet. 
                                Patients will be able to book appointments with you through the platform.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DoctorBookingRecords