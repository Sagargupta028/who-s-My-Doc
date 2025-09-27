const express = require('express')
const { hashPassword } = require('../helper/authHelper')
const Router = express.Router()

module.exports = (models) => {
    const { Doctor, Patient } = models;
    
    Router.post('/', async (req, res) => {
        try {
            const { type, email, password, name } = req.body;
            
            // Basic validation
            if (!email || !password || !name || !type) {
                return res.status(400).json({
                    status: false,
                    message: "Email, password, name, and type are required"
                });
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: false,
                    message: "Please provide a valid email address"
                });
            }
            
            if (req.body.type === 'doctor') {
                let doctorData = req.body;
                doctorData.password = await hashPassword(doctorData.password);
                delete doctorData.type;
                
                // Set required fields with defaults if missing
                doctorData.review = 0;
                doctorData.count = 0;
                
                // Set username to name if not provided (required field)
                if (!doctorData.username) {
                    doctorData.username = doctorData.name;
                }
                
                // Validate required fields
                const requiredFields = ['name', 'email', 'password', 'username', 'qualification', 'specialisation', 'fees', 'location', 'timeslot_start', 'timeslot_end'];
                const missingFields = requiredFields.filter(field => !doctorData[field] && doctorData[field] !== 0);
                
                if (missingFields.length > 0) {
                    return res.status(400).json({
                        status: false,
                        message: `Missing required fields: ${missingFields.join(', ')}`,
                        missingFields: missingFields
                    });
                }
                
                console.log("Creating doctor with data:", doctorData);

                const newDoctor = new Doctor(doctorData);
                const savedDoctor = await newDoctor.save();
                
                // Remove password from response
                const doctorResponse = savedDoctor.toObject();
                delete doctorResponse.password;
                
                res.send({ status: true, content: doctorResponse });
            }
            else {
                const patientData = req.body;
                patientData.password = await hashPassword(patientData.password);
                delete patientData.type;
                delete patientData.username; // Remove username field as it's not in schema
                
                // Handle empty sex field - convert empty string to undefined
                if (patientData.sex === "" || patientData.sex === null) {
                    delete patientData.sex;
                }
                
                // Handle empty phone field
                if (patientData.phone === "" || patientData.phone === null) {
                    delete patientData.phone;
                }
                
                // Handle empty address field
                if (patientData.address === "" || patientData.address === null) {
                    delete patientData.address;
                }
                
                console.log("Creating patient with data:", patientData);

                const newPatient = new Patient(patientData);
                const savedPatient = await newPatient.save();
                
                // Remove password from response
                const patientResponse = savedPatient.toObject();
                delete patientResponse.password;
                
                res.send({ status: true, content: patientResponse });
            }

        } catch (error) {
            console.log(error);
            
            // Handle duplicate key error (email already exists)
            if (error.code === 11000) {
                res.status(400).send({
                    status: false,
                    message: "Email already exists",
                    error: "Duplicate email"
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: "Error in registration",
                    error: error.message
                });
            }
        }
    })
    return Router
}

