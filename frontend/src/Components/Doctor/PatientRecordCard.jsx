import React from 'react'
import './PatientRecordCard.css'

function PatientRecordCard({ rec, index }) {
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

    const formatTime = (slot) => {
        return `${slot.toString().padStart(2, '0')}:00`;
    };

    const getStatusBadge = () => {
        if (isUpcoming) {
            return <span className="status-badge upcoming">Upcoming</span>;
        } else {
            return <span className="status-badge completed">Completed</span>;
        }
    };

    return (
        <div className={`patient-record-card ${isUpcoming ? 'upcoming' : 'past'} slide-in`} 
             style={{ animationDelay: `${index * 0.1}s` }}>
            
            {/* Card Header */}
            <div className="record-header">
                <div className="patient-info">
                    <div className="patient-avatar">
                        <span className="avatar-text">{rec.name?.charAt(0) || 'P'}</span>
                    </div>
                    <div className="patient-details">
                        <h3 className="patient-name">{rec.name || 'Unknown Patient'}</h3>
                        <div className="patient-email">
                            <span className="email-icon">📧</span>
                            {rec.email}
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
                                <span className="detail-value">{formatDate(rec.date_of_appointment)}</span>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-icon">🕐</span>
                            <div className="detail-content">
                                <span className="detail-label">Time</span>
                                <span className="detail-value">{formatTime(rec.slot_booked)}</span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <span className="detail-icon">👤</span>
                            <div className="detail-content">
                                <span className="detail-label">Age</span>
                                <span className="detail-value">{rec.age || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <span className="detail-icon">⚧</span>
                            <div className="detail-content">
                                <span className="detail-label">Gender</span>
                                <span className="detail-value">{rec.sex || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientRecordCard