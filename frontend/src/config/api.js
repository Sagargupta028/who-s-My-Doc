// API Configuration for Who's My Doc Frontend

// Get the base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  
  // Patient endpoints
  PATIENT: {
    FIND_DOCTOR: `${API_BASE_URL}/patient/find-doctor`,
    BOOK_DOCTOR: `${API_BASE_URL}/patient/book-doctor`,
    PREVIOUS_RECORDS: `${API_BASE_URL}/patient/previous-records`,
    CANCEL_APPOINTMENT: `${API_BASE_URL}/patient/cancel-appointment`,
    UPDATE_PROFILE: `${API_BASE_URL}/patient/update-profile`,
    GET_LOCATIONS: `${API_BASE_URL}/patient/get-locations`,
    GET_SPECIALITIES: `${API_BASE_URL}/patient/get-specialities`,
  },
  
  // Doctor endpoints
  DOCTOR: {
    GET_APPOINTMENTS: `${API_BASE_URL}/doctor/appointments`,
    UPDATE_PROFILE: `${API_BASE_URL}/doctor/update-profile`,
  },
  
  // Prediction endpoint
  PREDICTION: `${API_BASE_URL}/prediction`,
  
  // Utility endpoints
  LOCATIONS: `${API_BASE_URL}/locations`,
  SPECIALTIES: `${API_BASE_URL}/specialties`,
};

// Export the base URL for direct use if needed
export default API_BASE_URL;
