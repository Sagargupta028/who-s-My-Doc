import React, { useContext, useEffect, useState } from 'react';
import './Doctorpages.css';
import { AuthContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Navbar/NavBar';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../../config/api';
import Modal from './Modal';

const Doctorpages = () => {

  const [patientdetails, setpatientDetails] = useState('')
  
  // Generate dates for the next 7 days
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    dates.push(date.toISOString().split('T')[0])
  }

  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const [doctorData, setdoctorData] = useState({
    bookings: Array(7).fill().map(() => Array(8).fill().map(() => ({ status: false, content: {} }))), // Default 7 days x 8 hours with proper structure
    start_time: 9 // Default start time 9 AM
  });

  // Authentication check using useEffect
  useEffect(() => {
    if (!isAuthenticated[0]) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Get email safely
  let email = ''
  if (isAuthenticated[0] && isAuthenticated[1]) {
    email = isAuthenticated[1].email
  }

  // Don't render if not authenticated
  if (!isAuthenticated[0]) {
    return <div>Redirecting to login...</div>;
  }

  // Function to render timing slots
  const renderTimingSlots = () => {
    const { start_time, bookings } = doctorData;
    const timingSlots = [];
    for (let i = 0; i < bookings[0].length; i++) {
      timingSlots.push(
        <th key={i} className="time-header" style={{ textAlign: 'center' }}>
          🕐 {start_time + i}:00 - {start_time + i + 1}:00
        </th>
      );
    }
    return timingSlots;
  };

  // Function to render schedule in grid format
  const renderSchedule = () => {
    const { schedule, bookings } = doctorData;
    const { start_time } = doctorData;
    
    return (
      <div className="schedule-grid-container">
        {dates.map((date, dateIndex) => (
          <div key={date} className="day-schedule">
            {/* Date Header */}
            <div className="day-header">
              <h3 className="day-title">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h3>
            </div>
            
            {/* Slots Grid - 7 slots per row */}
            <div className="day-slots-grid">
              {bookings[dateIndex].map((booking, slotIndex) => (
                <button 
                  key={slotIndex}
                  className={`doctor-slot-btn ${booking?.status ? 'slot-booked' : 'slot-available'}`} 
                  disabled={booking?.status || false} 
                  name={booking?.status ? booking?.content?.patient_email || '' : ''} 
                  onClick={handleShowPatient} 
                  date={dates[dateIndex]} 
                  slot={slotIndex}
                >
                  <div className="slot-time">
                    {start_time + slotIndex}:00
                  </div>
                  <div className="slot-status">
                    {booking?.status ? '🔒 Booked' : '✅ Available'}
                  </div>
                  {booking?.status && (
                    <div className="patient-name">
                      {booking?.content?.patient_name || 'Patient'}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getdatadoctor = async () => {
    try {
      console.log('Fetching doctor data for email:', email);
      const result = await axios.post(`${API_BASE_URL}/doctor`, { 'email': email });
      console.log('Doctor data received:', result.data);
      
      if (result.data && result.data.slots && result.data.start_time) {
        setdoctorData((data) => {
          return { 
            ...data, 
            'bookings': result.data.slots, 
            'start_time': result.data.start_time 
          }
        });
      } else {
        console.log('Invalid doctor data format, using defaults');
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      // Keep default values if API fails
    }
  }

  const showmodal = () => {
    const btn = document.getElementById('openmodal')
    btn.click();
  }

  const handleShowPatient = async (e) => {
    console.log(e.target.getAttribute('date'))
    await axios.post(`${API_BASE_URL}/doctor/get-patient`, { 'patient_email': e.target.name }).then((result) => {
      console.log(result.data)
      setpatientDetails({
        ...result.data,
        'date': e.target.getAttribute('date'),
        'slot': `${doctorData.start_time + parseInt(e.target.getAttribute('slot'))}-${doctorData.start_time + parseInt(e.target.getAttribute('slot')) + 1}`
      })

    }).catch((error) => {
      console.log(error)
    })
  }
  // console.log(patientdetails)

  useEffect(() => {
    getdatadoctor()
  }, [])
  console.log(patientdetails)
  useEffect(() => {
    if (patientdetails !== '')
      showmodal()
  }, [patientdetails])


  return (
    <div className="doctor-dashboard">
      <NavBar />
      
      <div className="dashboard-container">
        {/* Hero Section */}
        <div className="doctor-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Welcome, Dr. {isAuthenticated[1]?.name || 'Doctor'}</h1>
              <p>Manage your appointments and schedule efficiently</p>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">24</div>
                <div className="stat-label">Today's Appointments</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">156</div>
                <div className="stat-label">Total Patients</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">4.8</div>
                <div className="stat-label">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="schedule-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📅</span>
              Weekly Schedule
            </h2>
          </div>
          <div className="schedule-container">
            {renderSchedule()}
          </div>
        </div>

        {/* Hidden Modal Trigger */}
        <button 
          type="button" 
          className="btn btn-primary" 
          data-bs-toggle="modal" 
          data-bs-target="#exampleModal" 
          id='openmodal' 
          style={{ display: 'none' }}
        >
          Launch demo modal
        </button>
        
        <Modal patientdetails={patientdetails} />
      </div>
    </div>
  );
};

export default Doctorpages;
