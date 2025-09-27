import React from 'react'
import { Link } from 'react-router-dom';

function DoctorSearchForm({ handleSubmit, handleChange, formData, handlechangeBookingDetails, specialties, locations, minDate, maxDate }) {
    
    return (
        <div className="search-form-card card-modern slide-up">
            <div className="search-form-header">
                <div className="form-icon">🔍</div>
                <h2 className="form-title">Find Your Doctor</h2>
                <p className="form-subtitle">Search for healthcare professionals in your area</p>
            </div>
            
            <form id='searchform' onSubmit={handleSubmit} className="search-form">
                <div className="form-grid">
                    <div className="input-group">
                        <label className="label-modern">
                            <span className="label-icon">🩺</span>
                            Specialization
                        </label>
                        <div className="input-wrapper">
                            <select
                                name="specialisation"
                                value={formData.specialisation}
                                onChange={handleChange}
                                className="input-modern select-modern"
                                required
                            >
                                <option value="">Choose Specialization</option>
                                {specialties.map((specialisation, index) => (
                                    <option key={index} value={specialisation}>
                                        {specialisation}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="label-modern">
                            <span className="label-icon">📍</span>
                            Location
                        </label>
                        <div className="input-wrapper">
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="input-modern select-modern"
                                required
                            >
                                <option value="">Choose Location</option>
                                {locations.map((location, index) => (
                                    <option key={index} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="label-modern">
                            <span className="label-icon">📅</span>
                            Appointment Date
                        </label>
                        <div className="input-wrapper">
                            <input
                                type="date"
                                name="date"
                                min={minDate}
                                max={maxDate}
                                value={formData.date}
                                onChange={(event) => {
                                    handleChange(event);
                                    handlechangeBookingDetails("date_of_appointment", event.target.value);
                                }}
                                className="input-modern"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="help-section">
                    <div className="help-card">
                        <span className="help-icon">❓</span>
                        <div className="help-content">
                            <span>Don't know which specialist to consult?</span>
                            <Link to='/predict-doctor' target='_blank' className="help-link">
                                Try our Symptom Checker →
                            </Link>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-modern btn-primary search-btn">
                    <span className="btn-icon">🔍</span>
                    Find Available Doctors
                </button>
            </form>
        </div>
    )
}

export default DoctorSearchForm