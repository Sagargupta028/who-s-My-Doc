import React from 'react'
import './DoctorCard.css'

function DoctorCard({ doctor, index, handlechangeBookingDetails, bookingDetails, date, loc, fees }) {
    console.log(doctor)
    const isSelected = doctor.email === bookingDetails.doctor_email;
    
    return (
        <div className={`doctor-card card-modern ${isSelected ? 'selected' : ''} scale-in`} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="doctor-main">
                <div className="doctor-content">
                    {/* Left Section - Doctor Info */}
                    <div className="doctor-info-section">
                        {/* First Row: Avatar + Name + Specialization + Experience + Rating */}
                        <div className="doctor-header">
                            <div className="doctor-avatar">
                                <span className="avatar-text">{doctor.name.charAt(0)}</span>
                            </div>
                            <div className="doctor-info">
                                <h3 className="doctor-name">{doctor.name}</h3>
                                <div className="doctor-specialization">
                                    <span className="spec-icon">🩺</span>
                                    {doctor.specialisation}
                                </div>
                                <div className="doctor-experience">
                                    <span className="exp-icon">⏳</span>
                                    {doctor.experience || '5'} Years
                                </div>
                                <div className="doctor-rating">
                                    <div className="rating-stars">
                                        {'⭐'.repeat(5)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Second Row: Qualification + Location + Fee */}
                        <div className="doctor-details">
                            <div className="detail-item">
                                <span className="detail-icon">🎓</span>
                                <span className="detail-label">Qualification:</span>
                                <span className="detail-value">{doctor.qualification}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-icon">📍</span>
                                <span className="detail-label">Location:</span>
                                <span className="detail-value">{doctor.location}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-icon">💰</span>
                                <span className="detail-label">Fee:</span>
                                <span className="detail-value fee-value">₹{doctor.fees}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Time Slots */}
                    <div className="slots-section">
                        <h4 className="slots-title">
                            <span className="slots-icon">🕐</span>
                            Available Slots
                        </h4>
                        <div className="slots-grid">
                            {doctor.slots.map((slot, index2) => (
                                <button 
                                    key={index2} 
                                    className={`slot-btn ${
                                        slot 
                                            ? (doctor.email === bookingDetails.doctor_email && index2 === bookingDetails.slot_booked) 
                                                ? "slot-selected" 
                                                : "slot-available"
                                            : "slot-unavailable"
                                    }`}
                                    disabled={!slot}
                                    onClick={() => {
                                        if (slot) {
                                            handlechangeBookingDetails("doctor_email", doctor.email);
                                            handlechangeBookingDetails("slot_booked", index2);
                                            handlechangeBookingDetails("date_of_appointment", date);
                                            handlechangeBookingDetails("doctor_name", doctor.name);
                                            handlechangeBookingDetails('location', loc);
                                            handlechangeBookingDetails('fees', doctor.fees);
                                            handlechangeBookingDetails('timeslot_start', doctor.timeslot_start);
                                        }
                                    }}
                                >
                                    <span className="slot-time">
                                        {String(doctor.timeslot_start + index2).padStart(2, '0')}:00
                                    </span>
                                    <span className="slot-status">
                                        {slot 
                                            ? (doctor.email === bookingDetails.doctor_email && index2 === bookingDetails.slot_booked) 
                                                ? "Selected" 
                                                : "Available"
                                            : "Booked"
                                        }
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isSelected && (
                <div className="selection-indicator fade-in">
                    <div className="indicator-content">
                        <span className="indicator-icon">✅</span>
                        <span className="indicator-text">Selected for booking</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DoctorCard