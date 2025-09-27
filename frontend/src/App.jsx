import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./styles/globals.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import Patientpages from "./Components/Patient.jsx/Patientpages";
import Doctorpages from "./Components/Doctor/Doctorpages";

import Home from "./Components/Homepage/Home";
import PatientProfile from "./Components/Patient.jsx/PatientProfile";
import DoctorProfile from "./Components/UserProfile/DoctorProfile";
import ProfilePatient from "./Components/UserProfile/ProfilePatient";
import DoctorBookingRecords from "./Components/Doctor/DoctorBookingRecords";
import PredictDoc from "./Components/PredictDoc/PredictDoc";

function App() {
  const [count, setCount] = useState(0);
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/doctor" element={<Doctorpages />} />
        <Route
          exact
          path="/doctor-booking-history"
          element={<DoctorBookingRecords />}
        />
        <Route exact path="/patient" element={<Patientpages />} />
        <Route exact path="/patient-profile" element={<PatientProfile />} />
        <Route exact path="/doctor-user-prof" element={<DoctorProfile />} />
        <Route exact path="/patient-user-prof" element={<ProfilePatient />} />
        <Route exact path="/predict-doctor" element={<PredictDoc />} />

        <Route
          exact
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-primary text-white">
              <div className="text-center fade-in">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-2xl mb-8">Page Not Found</p>
                <a href="/" className="btn-modern btn-outline">
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
          fontSize: '14px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        }}
      />
    </BrowserRouter>
  );
}

export default App;
