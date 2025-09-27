import axios from "axios";
import React, { useState } from 'react';
import './PredictDoc.css';
import NavBar from '../Navbar/NavBar';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';
export default function PredictDoc() {
  const [options, setOptions] = useState([
    "Select your symptom",
    "itching",
    "skin_rash",
    "red_sore_around_nose",
    "muscle_weakness",
    "weakness_in_limbs",
    "chest_pain",
    "sweating",
    "depression",
    "bruising",
    "dizziness",
    "anxiety",
    "muscle_pain",
    "neck_pain",
    "back_pain",
    "cramps",
    "puffy_face_and_eyes",
    "headache",
    "nausea",
    "vomiting",
    "fatigue",
    "fever",
    "cough",
    "breathlessness",
    "joint_pain",
    "stomach_pain",
    "weight_loss",
    "weight_gain",
    "high_fever",
    "mild_fever",
    "abdominal_pain",
    "constipation",
    "diarrhoea",
    "loss_of_appetite",
    "yellowish_skin",
    "dark_urine",
    "dehydration",
    "indigestion",
    "acidity",
    "restlessness",
    "lethargy",
    "mood_swings",
    "cold_hands_and_feets",
    "shivering",
    "chills",
    "continuous_sneezing",
    "runny_nose",
    "congestion",
    "sinus_pressure",
    "throat_irritation",
    "redness_of_eyes",
    "watering_from_eyes",
    "blurred_and_distorted_vision",
    "knee_pain",
    "hip_joint_pain",
    "swelling_joints",
    "movement_stiffness",
    "spinning_movements",
    "loss_of_balance",
    "unsteadiness"
  ]);
  //   symptoms =

  const [symptoms, setSymptoms] = useState([]);
  const [predicedtype, setPredictedtype] = useState(false);
  const [valuesymp, setValuesymp] = useState("Select your symptom");
  const [isLoading, setIsLoading] = useState(false);
  function formatSymptom(symptom) {
    return symptom
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  console.log(symptoms);
  const handleChange = (e) => {
    if (e.target.value === "Select your symptom") return;
    console.log(e.target.value);
    setValuesymp(e.target.value);
    setSymptoms((st) => {
      return [...st, e.target.value];
    });
    setOptions((opt) => {
      return opt.filter((val) => val !== e.target.value);
    });
    if (predicedtype !== "") setPredictedtype(false);
    // Reset select to default
    setValuesymp("Select your symptom");
  };

  const removeSymptom = (symptomToRemove) => {
    setSymptoms((st) => st.filter(symptom => symptom !== symptomToRemove));
    setOptions((opt) => [...opt, symptomToRemove].sort());
    if (predicedtype !== "") setPredictedtype(false);
  };

  const clearAllSymptoms = () => {
    setSymptoms([]);
    setOptions([
      "Select your symptom",
      "itching",
      "skin_rash",
      "red_sore_around_nose",
      "muscle_weakness",
      "weakness_in_limbs",
      "chest_pain",
      "sweating",
      "depression",
      "bruising",
      "dizziness",
      "anxiety",
      "muscle_pain",
      "neck_pain",
      "back_pain",
      "cramps",
      "puffy_face_and_eyes",
      "headache",
      "nausea",
      "vomiting",
      "fatigue",
      "fever",
      "cough",
      "breathlessness",
      "joint_pain",
      "stomach_pain",
      "weight_loss",
      "weight_gain",
      "high_fever",
      "mild_fever",
      "abdominal_pain",
      "constipation",
      "diarrhoea",
      "loss_of_appetite",
      "yellowish_skin",
      "dark_urine",
      "dehydration",
      "indigestion",
      "acidity",
      "restlessness",
      "lethargy",
      "mood_swings",
      "cold_hands_and_feets",
      "shivering",
      "chills",
      "continuous_sneezing",
      "runny_nose",
      "congestion",
      "sinus_pressure",
      "throat_irritation",
      "redness_of_eyes",
      "watering_from_eyes",
      "blurred_and_distorted_vision",
      "knee_pain",
      "hip_joint_pain",
      "swelling_joints",
      "movement_stiffness",
      "spinning_movements",
      "loss_of_balance",
      "unsteadiness"
    ]);
    setValuesymp("Select your symptom");
    if (predicedtype !== "") setPredictedtype(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (symptoms.length === 0) {
      toast.error('Please select at least one symptom before submitting.');
      return;
    }
    
    setIsLoading(true);
    console.log('Submitting symptoms:', symptoms);
    
    try {
      const result = await axios.post(API_ENDPOINTS.PREDICTION, { issues: symptoms });
      console.log('Prediction response:', result.data);
      
      // Handle the new response format
      if (result.data.success) {
        setPredictedtype(result.data.prediction);
      } else if (typeof result.data === 'string') {
        // Handle old format for backward compatibility
        setPredictedtype(result.data);
      } else {
        setPredictedtype('Unable to get prediction. Please try again.');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          setPredictedtype(`Error: ${errorData.message}`);
        } else {
          setPredictedtype('Error: Unable to get prediction. Please try again.');
        }
      } else {
        setPredictedtype('Error: Unable to connect to prediction service.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="predict-page">
        {/* Hero Section with Blue Gradient */}
        <div className="hero-gradient-section">
          <div className="hero-content">
            <h1 className="hero-title">
              My Doctor <span className="prediction-text">Prediction</span>
            </h1>
            <p className="hero-subtitle">Smart Symptom Analysis</p>
            <p className="hero-description">
              Select your symptoms and let our system help you identify potential medical specializations.
            </p>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="predict-container">
          {/* Symptom Checker Card */}
          <div className="predict-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">🩺</span>
              Symptom Checker
            </h2>
          </div>

          <div className="card-body">
            <form className="form" onSubmit={handleSubmit}>
              {/* Input Section */}
              <div className="form-section">
                <div className="select-container">
                  <label className="select-label">
                    <span className="section-icon">🔍</span>
                    Choose Your Symptoms
                  </label>
                  <select
                    className="select-box"
                    name="symptoms"
                    onChange={handleChange}
                    value={valuesymp}
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {formatSymptom(opt)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Symptoms Section */}
              <div className="form-section">
                <div className="symptoms-header">
                  <h3 className="sub-heading">
                    <span className="section-icon">📋</span>
                    Selected Symptoms ({symptoms.length})
                  </h3>
                  {symptoms.length > 0 && (
                    <button
                      type="button"
                      className="btn-modern btn-outline"
                      onClick={clearAllSymptoms}
                    >
                      <span className="btn-icon">🗑️</span>
                      Clear All
                    </button>
                  )}
                </div>

                <div className="symptoms-container">
                  {symptoms.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🏥</div>
                      <p className="empty-text">
                        No symptoms selected yet. Please choose symptoms from the dropdown above.
                      </p>
                    </div>
                  ) : (
                    symptoms.map((st) => (
                      <div key={st} className="symptom-badge">
                        <span>{formatSymptom(st)}</span>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeSymptom(st)}
                          aria-label="Remove symptom"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  type="submit"
                  className="btn-modern btn-primary"
                  disabled={isLoading || symptoms.length === 0}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🔬</span>
                      Get Prediction
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Result Section */}
            {predicedtype !== false && (
              <div className="result-section">
                <div className="result-card">
                  <div className="result-icon">🎯</div>
                  <p className="result-text">{predicedtype}</p>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
