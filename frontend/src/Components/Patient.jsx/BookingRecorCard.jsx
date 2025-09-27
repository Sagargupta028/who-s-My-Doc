import React from 'react'
import './BookingRecordsCard.css'

function BookingRecorCard({ rec, index, onCancel }) {
    const appointmentDate = new Date(rec.date_of_appointment);
    const today = new Date();
    const isUpcoming = appointmentDate >= today;
    const isPast = appointmentDate < today;
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (slot, startTime) => {
        const hour = slot + startTime;
        return `${hour.toString().padStart(2, '0')}:00`;
    };

    const getStatusBadge = () => {
        if (isUpcoming) {
            return <span className="status-badge upcoming">Upcoming</span>;
        } else {
            return <span className="status-badge completed">Completed</span>;
        }
    };

    return (
        <div className={`record-card card-modern ${isUpcoming ? 'upcoming' : 'past'} scale-in`} 
             style={{ animationDelay: `${index * 0.1}s` }}>
            
            {/* Main Card Content */}
            <div className="record-main">
                {/* Card Header */}
                <div className="record-header">
                    <div className="doctor-info">
                        <div className="doctor-avatar">
                            <span className="avatar-text">{rec.doctor.name.charAt(0)}</span>
                        </div>
                        <div className="doctor-details">
                            <h3 className="doctor-name">{rec.doctor.name}</h3>
                            <div className="doctor-specialization">
                                <span className="spec-icon">🩺</span>
                                {rec.doctor.specialisation}
                            </div>
                        </div>
                    </div>
                    <div className="record-status">
                        {getStatusBadge()}
                    </div>
                </div>

                {/* Card Content */}
                <div className="record-content">
                    <div className="record-details">
                        <div className="detail-row">
                            <div className="detail-item">
                                <span className="detail-icon">📅</span>
                                <div className="detail-content">
                                    <span className="detail-label">Date</span>
                                    <span className="detail-value">{new Date(rec.date_of_appointment).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div className="detail-item">
                                <span className="detail-icon">🕐</span>
                                <div className="detail-content">
                                    <span className="detail-label">Time</span>
                                    <span className="detail-value">{formatTime(rec.slot_booked, rec.doctor.timeslot_start)}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <span className="detail-icon">📍</span>
                                <div className="detail-content">
                                    <span className="detail-label">Location</span>
                                    <span className="detail-value">{rec.doctor.location}</span>
                                </div>
                            </div>

                            <div className="detail-item fee-item">
                                <span className="detail-icon">💰</span>
                                <div className="detail-content">
                                    <span className="detail-label">Fee</span>
                                    <span className="detail-value">₹{rec.doctor.fees}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Actions - Below the card */}
            {isUpcoming && (
                <div className="record-actions">
                    <div className="action-buttons">
                        <button 
                            className="action-btn danger"
                            onClick={() => onCancel && onCancel(rec, rec.doctor.email, rec.date_of_appointment)}
                        >
                            <span className="btn-icon">❌</span>
                            Cancel Appointment
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BookingRecorCard