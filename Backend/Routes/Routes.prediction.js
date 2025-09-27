const express = require('express')
const Router = express.Router()

// Symptom to Doctor mapping function
function getSymptomBasedPrediction(symptoms) {
    const symptomMap = {
        // Respiratory symptoms
        'cough': 'Pulmonologist',
        'breathlessness': 'Pulmonologist',
        'chest_pain': 'Cardiologist',
        'throat_irritation': 'ENT Specialist',
        'runny_nose': 'ENT Specialist',
        'congestion': 'ENT Specialist',
        'sinus_pressure': 'ENT Specialist',
        'continuous_sneezing': 'Allergist',
        
        // Gastrointestinal symptoms
        'stomach_pain': 'Gastroenterologist',
        'abdominal_pain': 'Gastroenterologist',
        'nausea': 'Gastroenterologist',
        'vomiting': 'Gastroenterologist',
        'diarrhoea': 'Gastroenterologist',
        'constipation': 'Gastroenterologist',
        'indigestion': 'Gastroenterologist',
        'acidity': 'Gastroenterologist',
        'loss_of_appetite': 'Gastroenterologist',
        
        // Neurological symptoms
        'headache': 'Neurologist',
        'dizziness': 'Neurologist',
        'blurred_and_distorted_vision': 'Neurologist',
        'spinning_movements': 'Neurologist',
        'loss_of_balance': 'Neurologist',
        'unsteadiness': 'Neurologist',
        
        // Musculoskeletal symptoms
        'joint_pain': 'Rheumatologist',
        'muscle_pain': 'Rheumatologist',
        'muscle_weakness': 'Rheumatologist',
        'back_pain': 'Orthopedic Surgeon',
        'neck_pain': 'Orthopedic Surgeon',
        'knee_pain': 'Orthopedic Surgeon',
        'hip_joint_pain': 'Orthopedic Surgeon',
        'swelling_joints': 'Rheumatologist',
        'movement_stiffness': 'Rheumatologist',
        
        // Dermatological symptoms
        'skin_rash': 'Dermatologist',
        'itching': 'Dermatologist',
        'red_sore_around_nose': 'Dermatologist',
        
        // Cardiovascular symptoms
        'chest_pain': 'Cardiologist',
        'fast_heart_rate': 'Cardiologist',
        'palpitations': 'Cardiologist',
        
        // Endocrine symptoms
        'weight_loss': 'Endocrinologist',
        'weight_gain': 'Endocrinologist',
        'excessive_hunger': 'Endocrinologist',
        'increased_appetite': 'Endocrinologist',
        'polyuria': 'Endocrinologist',
        
        // Hepatic symptoms
        'yellowish_skin': 'Hepatologist',
        'dark_urine': 'Hepatologist',
        'yellowing_of_eyes': 'Hepatologist',
        
        // Psychiatric symptoms
        'anxiety': 'Psychiatrist',
        'depression': 'Psychiatrist',
        'mood_swings': 'Psychiatrist',
        'irritability': 'Psychiatrist',
        'restlessness': 'Psychiatrist',
        
        // General symptoms
        'fever': 'Internal Medicine Specialist',
        'high_fever': 'Internal Medicine Specialist',
        'mild_fever': 'Internal Medicine Specialist',
        'fatigue': 'Internal Medicine Specialist',
        'weakness_in_limbs': 'Internal Medicine Specialist',
        'lethargy': 'Internal Medicine Specialist',
        'sweating': 'Internal Medicine Specialist',
        'dehydration': 'Internal Medicine Specialist',
        'shivering': 'Internal Medicine Specialist',
        'chills': 'Internal Medicine Specialist',
        
        // Eye symptoms
        'redness_of_eyes': 'Ophthalmologist',
        'watering_from_eyes': 'Ophthalmologist',
        'blurred_and_distorted_vision': 'Ophthalmologist',
        
        // Urological symptoms
        'burning_micturition': 'Urologist',
        'continuous_feel_of_urine': 'Urologist',
        'bladder_discomfort': 'Urologist'
    };
    
    // Find the most relevant specialist based on symptoms
    // Priority system: more specific symptoms first
    const prioritySymptoms = ['chest_pain', 'breathlessness', 'yellowish_skin', 'skin_rash'];
    
    // Check priority symptoms first
    for (let symptom of prioritySymptoms) {
        if (symptoms.includes(symptom) && symptomMap[symptom]) {
            return `Please visit a: ${symptomMap[symptom]}`;
        }
    }
    
    // Check all other symptoms
    for (let symptom of symptoms) {
        if (symptomMap[symptom]) {
            return `Please visit a: ${symptomMap[symptom]}`;
        }
    }
    
    // Default recommendation
    return 'Please visit a: Internal Medicine Specialist';
}

module.exports = (models) => {
    Router.post('/', (req, res) => {
        const { issues } = req.body;
        
        console.log('Received prediction request with symptoms:', issues);
        
        if (!issues || !Array.isArray(issues) || issues.length === 0) {
            return res.status(400).send({
                error: 'No symptoms provided',
                message: 'Please select at least one symptom'
            });
        }
        
        try {
            // Get prediction based on symptom mapping
            const prediction = getSymptomBasedPrediction(issues);
            
            console.log('Generated prediction:', prediction);
            
            res.send({
                success: true,
                prediction: prediction,
                symptoms: issues,
                method: 'symptom_mapping',
                note: 'This recommendation is based on common symptom-specialist associations. Please consult with a healthcare professional for accurate diagnosis.'
            });
            
        } catch (error) {
            console.error('Error in prediction:', error);
            res.status(500).send({
                error: 'Prediction failed',
                message: 'Unable to generate prediction. Please try again.',
                details: error.message
            });
        }
    });
    
    return Router;
}


