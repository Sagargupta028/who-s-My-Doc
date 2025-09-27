import React, { useContext, useEffect, useState } from "react";
import img from "../../assets/backgoround.jpg";
import Navbar from "../Navbar/NavBar";
import "./Patientpages.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorSearchForm from "./doctorSearchForm";
import DoctorCard from "./DoctorCard";
import { AuthContext } from '../../context/AuthProvider';
import NavBar from "../Navbar/NavBar";
import Modal from "./Modal";
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';

const Patientpages = () => {

  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const [locations, setLocation] = useState([]);
  const [specialties, setSpecialities] = useState([]);
  
  // Fallback data in case API fails
  const defaultSpecialties = [
    'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 
    'Pediatrics', 'Psychiatry', 'General Medicine', 'Surgery'
  ];
  const defaultLocations = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 
    'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'
  ];
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  // const [bookingDetails,setBookingDetails]=useState('')
  const navigate = useNavigate();



  //getting the locations available
  const fetchlocations = async () => {
    try {
      console.log('Fetching locations from:', API_ENDPOINTS.PATIENT.GET_LOCATIONS);
      const result = await axios.get(API_ENDPOINTS.PATIENT.GET_LOCATIONS);
      console.log('Locations data:', result.data);
      if (result.data && result.data.length > 0) {
        setLocation(result.data);
      } else {
        console.log('No locations from API, using fallback data');
        setLocation(defaultLocations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      console.log('Using fallback locations data');
      setLocation(defaultLocations);
      toast.warning('Using default locations. Please check your connection.');
    }
  }

  const fetchSpecialities = async () => {
    try {
      console.log('Fetching specialties from:', API_ENDPOINTS.PATIENT.GET_SPECIALITIES);
      const result = await axios.get(API_ENDPOINTS.PATIENT.GET_SPECIALITIES);
      console.log('Specialties data:', result.data);
      if (result.data && result.data.length > 0) {
        setSpecialities(result.data);
      } else {
        console.log('No specialties from API, using fallback data');
        setSpecialities(defaultSpecialties);
      }
    } catch (error) {
      console.error('Error fetching specialties:', error);
      console.log('Using fallback specialties data');
      setSpecialities(defaultSpecialties);
      toast.warning('Using default specialties. Please check your connection.');
    }
  }
  useEffect(() => {
    fetchlocations();
    fetchSpecialities();
  }, [])

  useEffect(() => {
    if (isAuthenticated[0] === false)
      navigate('/login')
    else {
      setBookingDetails({ ...bookingDetails, patient_email: isAuthenticated[1].email })  //if user authenticated set patient_email for booking details
    }
  }, [isAuthenticated])

  //getting the dates available
  const currentDate = new Date();
  let minDate = new Date(currentDate);
  minDate.setDate(currentDate.getDate() + 1); // Adding 7 days to the current date
  let maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + 7);
  // Format the dates in yyyy-mm-dd format for the input field
  minDate = minDate.toISOString().split('T')[0];
  maxDate = maxDate.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    specialisation: specialties[0],
    location: locations[0],
    date: minDate,
  });

  useEffect(()=>{
    setFilteredDoctors([])
  },[formData])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //for booking the slot
  const [bookingDetails, setBookingDetails] = useState({
    doctor_email: '',
    patient_email: '',  //it will be fetched from the context api
    date_of_appointment: minDate,
    slot_booked: 0
  });

  const handlechangeBookingDetails = (name,value) => {
    // console.log(obj)
    console.log(name,value)
    setBookingDetails((details) => {
      return { ...details, [name]: value }
    })
    // setBookingDetails((prevobj)=>{
    //   return {...prevobj,...obj}
    // })
    console.log(bookingDetails);
  }



  const bookDoctor = async () => {
    // Validation
    if (!bookingDetails.doctor_email || !bookingDetails.slot_booked) {
      toast.error('Please select a doctor and time slot');
      return;
    }

    console.log(bookingDetails)
    const btn=document.getElementById('openmodalpatientbooking')
    btn.click()
    // navigate("/");   //write here required destination

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.specialisation || !formData.location || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log(formData); // Logging form data to console for demonstration
    if (formData.location != 'hulu') {
      axios.post(API_ENDPOINTS.PATIENT.FIND_DOCTOR, formData).then((result) => {
        console.log(result.data)
        setFilteredDoctors(result.data)
        if (result.data.length === 0) {
          toast.info('No doctors found for your search criteria. Try adjusting your filters.');
        } else {
          toast.success(`Found ${result.data.length} doctor(s) matching your criteria!`);
        }
      }).catch((error) => {
        console.log(error)
        toast.error('Failed to search doctors. Please try again.');
      })
    }
  };

  const doctorSubmit = (e) => {
    e.preventDefault();

    // Filter doctors based on the selected specialisation
    const selectedDoctors = filteredDoctors.filter((doctor) => doctor.selected);
    console.log("Selected Doctors:", selectedDoctors);

    // Clear form fields after logging data
    setFormData({
      specialisation: "",
      location: "",
      date: "",
    });

    // Reset selected state for doctors
    setFilteredDoctors(
      filteredDoctors.map((doctor) => ({ ...doctor, selected: false }))
    );
  };

  const handleDoctorSelection = (index) => {
    const updatedDoctors = filteredDoctors.map((doctor, i) => {
      if (i === index) {
        return { ...doctor, selected: !doctor.selected };
      }
      return doctor;
    });
    setFilteredDoctors(updatedDoctors);
  };

  return (
    <div className="patient-page">
      <NavBar />
      <Modal bookingDetails={bookingDetails} setBookingDetails={setBookingDetails} refreshpage={handleSubmit}/>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id='openmodalpatientbooking' style={{ display: 'none' }}>
        Launch demo modal
      </button>

      {/* Hero Section */}
      <div className="patient-hero">
        <div className="hero-content">
          <div className="hero-text fade-in">
            <h1 className="hero-title">
              Find Your Perfect <span className="gradient-text">Doctor</span>
            </h1>
            <p className="hero-description">
              Book appointments with qualified healthcare professionals in your area. 
              Get the care you deserve with our easy-to-use booking system.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{specialties.length}+</div>
                <div className="stat-label">Specialties</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{locations.length}+</div>
                <div className="stat-label">Locations</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <DoctorSearchForm 
            handleSubmit={handleSubmit} 
            handleChange={handleChange} 
            formData={formData} 
            handlechangeBookingDetails={handlechangeBookingDetails} 
            specialties={specialties} 
            locations={locations} 
            minDate={minDate} 
            maxDate={maxDate}
          />
        </div>
      </div>

      {/* Results Section */}
      {filteredDoctors.length > 0 && (
        <div className="results-section">
          <div className="results-container">
            <div className="results-header">
              <h2 className="results-title fade-in">
                <span className="results-icon">👨‍⚕️</span>
                Available Doctors
                <span className="results-count">({filteredDoctors.length} found)</span>
              </h2>
              <p className="results-subtitle fade-in">
                Choose your preferred doctor and book an appointment
              </p>
            </div>

            <div className="doctors-grid">
              {filteredDoctors.map((doctor, index) => (
                <DoctorCard
                  key={index}
                  index={index}
                  handlechangeBookingDetails={handlechangeBookingDetails}
                  doctor={doctor}
                  bookingDetails={bookingDetails}
                  date={formData.date}
                  loc={formData.location}
                />
              ))}
            </div>

            {/* Booking Action */}
            <div className="booking-action">
              <button
                onClick={bookDoctor}
                className={`btn-modern ${bookingDetails.doctor_email !== "" ? 'btn-primary' : 'btn-outline'} booking-btn`}
                disabled={bookingDetails.doctor_email === ""}
              >
                <span className="btn-icon">
                  {bookingDetails.doctor_email !== "" ? "📅" : "👆"}
                </span>
                {bookingDetails.doctor_email !== "" ? "Book Your Appointment" : "Select a Doctor & Time Slot"}
              </button>
              
              {bookingDetails.doctor_email !== "" && (
                <div className="booking-summary fade-in">
                  <div className="summary-card">
                    <h4>Booking Summary</h4>
                    <div className="summary-details">
                      <div className="summary-item">
                        <span className="summary-label">Doctor:</span>
                        <span className="summary-value">{bookingDetails.doctor_name}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Date:</span>
                        <span className="summary-value">{bookingDetails.date_of_appointment}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Time:</span>
                        <span className="summary-value">{bookingDetails.timeslot_start + bookingDetails.slot_booked}:00</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Fee:</span>
                        <span className="summary-value">₹{bookingDetails.fees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredDoctors.length === 0 && formData.specialisation && (
        <div className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">🔍</div>
            <h3>No doctors found</h3>
            <p>Try adjusting your search criteria or check back later.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patientpages;
