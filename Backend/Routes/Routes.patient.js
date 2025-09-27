const express = require('express')
const Router = express.Router()
const { hashPassword } = require('../helper/authHelper')
const { sendMail, sendSimpleEmail } = require('../helper/mailer')

module.exports = (models) => {
    const { Doctor, Patient, BookingDetails } = models;

    //finding the doctors available
    Router.post('/find-doctor', async (req, res) => {
        try {
            const { date, location, specialisation } = req.body;

            // Find doctors with matching specialisation and location
            const doctors = await Doctor.find({ 
                specialisation: specialisation, 
                location: location 
            }).select('-password');

            if (doctors.length === 0) {
                return res.send([]);
            }

            const final_list = [];
            
            // Process each doctor to get their availability
            for (let doc of doctors) {
                // Create availability array
                let slots = new Array(doc.timeslot_end - doc.timeslot_start).fill(1);
                
                // Find booked slots for this doctor on the specified date
                const bookedSlots = await BookingDetails.find({
                    doctor_email: doc.email,
                    date_of_appointment: new Date(date)
                });

                // Mark booked slots as unavailable (0)
                bookedSlots.forEach(booking => {
                    const slotIndex = booking.slot_booked;
                    if (slotIndex >= 0 && slotIndex < slots.length) {
                        slots[slotIndex] = 0;
                    }
                });

                final_list.push({ 
                    ...doc.toObject(), 
                    slots: slots 
                });
            }

            res.send(final_list);
        } catch (error) {
            console.log(error);
            res.status(400).send({ error: error.message });
        }
    })


    //getting the locations available
    Router.get('/get-locations', async (req, res) => {
        try {
            const locations = await Doctor.distinct('location');
            res.send(locations);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    })
    
    //getting the specialities available
    Router.get('/get-specialities', async (req, res) => {
        try {
            const specialisations = await Doctor.distinct('specialisation');
            res.send(specialisations);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    })


    //booking for the doctor
    Router.post('/book-doctor', async (req, res) => {
        try {
            let { patient_email, doctor_email, date_of_appointment, slot_booked } = req.body;

            // Get doctor details for email
            const doctor = await Doctor.findOne({ email: doctor_email });
            if (!doctor) {
                return res.status(400).send({ error: 'Doctor not found' });
            }

            const doc_name = doctor.name;
            const doc_location = doctor.location;
            const actual_slot = slot_booked + doctor.timeslot_start;

            // Create booking
            const bookingData = {
                patient_email,
                doctor_email,
                date_of_appointment: new Date(date_of_appointment),
                slot_booked
            };

            const newBooking = new BookingDetails(bookingData);
            const savedBooking = await newBooking.save();

            // Send confirmation email
            sendMail(patient_email, doctor_email, date_of_appointment, actual_slot, doc_name, doc_location);

            res.send({
                status: true,
                booking: savedBooking,
                message: 'Booking confirmed successfully'
            });

        } catch (error) {
            console.log(error);
            if (error.code === 11000) {
                res.status(400).send({ 
                    status: false, 
                    message: 'This slot is already booked' 
                });
            } else {
                res.status(400).send({ 
                    status: false, 
                    message: 'Error in booking',
                    error: error.message 
                });
            }
        }
    })


    Router.post('/previous-records', async (req, res) => {
        try {
            const { email } = req.body;
            
            // Find all bookings for this patient
            const bookings = await BookingDetails.find({ patient_email: email })
                .sort({ date_of_appointment: -1 });

            if (bookings.length === 0) {
                return res.send([]);
            }

            const final_records = [];
            
            // Get doctor details for each booking
            for (let booking of bookings) {
                const doctor = await Doctor.findOne({ email: booking.doctor_email })
                    .select('name email specialisation qualification timeslot_start fees location');
                
                if (doctor) {
                    final_records.push({
                        ...booking.toObject(),
                        doctor: doctor.toObject(),
                        date_of_appointment: booking.date_of_appointment.toISOString().split('T')[0]
                    });
                }
            }

            res.send(final_records);
        } catch (error) {
            console.log(error);
            res.status(400).send({ error: error.message });
        }
    })

    Router.post('/update', async (req, res) => {
        try {
            let { type, updatetype, newvalue, samefield, samevalue } = req.body;
            
            if (updatetype === 'password') {
                newvalue = await hashPassword(newvalue);
            }

            // Determine which model to use
            const Model = type === 'doctor' ? Doctor : Patient;
            
            // Create update object
            const updateObj = {};
            updateObj[updatetype] = newvalue;
            
            // Create query object
            const queryObj = {};
            queryObj[samefield] = samevalue;
            
            // Update the document
            const updatedUser = await Model.findOneAndUpdate(
                queryObj,
                updateObj,
                { new: true, select: '-password' }
            );
            
            if (!updatedUser) {
                return res.status(404).send({ 
                    status: false, 
                    message: 'User not found' 
                });
            }
            
            res.send({ 
                status: true, 
                user: updatedUser,
                message: 'Profile updated successfully'
            });
            
        } catch (error) {
            console.log(error);
            res.status(400).send({ 
                status: false, 
                error: error.message 
            });
        }
    })

    // Cancel appointment
    Router.post('/cancel-appointment', async (req, res) => {
        try {
            const { patient_email, doctor_email, date_of_appointment } = req.body;

            // Debug: Log received data
            console.log('Cancel appointment request received:', {
                patient_email,
                doctor_email,
                date_of_appointment,
                body: req.body
            });

            // Validate required fields
            if (!patient_email || !doctor_email || !date_of_appointment) {
                console.log('Validation failed - missing fields:', {
                    patient_email: !!patient_email,
                    doctor_email: !!doctor_email,
                    date_of_appointment: !!date_of_appointment
                });
                return res.status(400).send({ 
                    success: false, 
                    message: 'Missing required fields',
                    received: { patient_email, doctor_email, date_of_appointment }
                });
            }

            // Parse and normalize the date
            let appointmentDate;
            try {
                // Handle both string dates (YYYY-MM-DD) and Date objects
                if (typeof date_of_appointment === 'string') {
                    appointmentDate = new Date(date_of_appointment + 'T00:00:00.000Z');
                } else {
                    appointmentDate = new Date(date_of_appointment);
                }
                
                // Ensure we're working with a valid date
                if (isNaN(appointmentDate.getTime())) {
                    throw new Error('Invalid date');
                }
                
                console.log('Parsed appointment date:', appointmentDate);
            } catch (dateError) {
                console.log('Date parsing error:', dateError);
                return res.status(400).send({ 
                    success: false, 
                    message: 'Invalid date format' 
                });
            }

            // Try to find the booking with different date matching strategies
            let deletedBooking = await BookingDetails.findOneAndDelete({
                patient_email: patient_email,
                doctor_email: doctor_email,
                date_of_appointment: appointmentDate
            });

            // If not found, try with date range (start and end of day)
            if (!deletedBooking) {
                const startOfDay = new Date(appointmentDate);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(appointmentDate);
                endOfDay.setHours(23, 59, 59, 999);

                deletedBooking = await BookingDetails.findOneAndDelete({
                    patient_email: patient_email,
                    doctor_email: doctor_email,
                    date_of_appointment: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                });
            }

            if (!deletedBooking) {
                return res.status(404).send({ 
                    success: false, 
                    message: 'Appointment not found' 
                });
            }

            // Get doctor and patient details for email notification
            const doctor = await Doctor.findOne({ email: doctor_email }).select('name');
            const patient = await Patient.findOne({ email: patient_email }).select('name');

            // Send cancellation email to both patient and doctor
            if (doctor && patient) {
                const appointmentDate = new Date(date_of_appointment).toLocaleDateString();
                const slot = deletedBooking.slot_booked + (doctor.timeslot_start || 0);
                
                // Email to patient
                const patientEmailContent = `
                    Dear ${patient.name},
                    
                    Your appointment with Dr. ${doctor.name} on ${appointmentDate} at ${slot}:00 has been successfully cancelled.
                    
                    If you need to book a new appointment, please visit our website.
                    
                    Best regards,
                    Who's My Doc Team
                `;

                // Email to doctor
                const doctorEmailContent = `
                    Dear Dr. ${doctor.name},
                    
                    The appointment with ${patient.name} on ${appointmentDate} at ${slot}:00 has been cancelled by the patient.
                    
                    Best regards,
                    Who's My Doc Team
                `;

                try {
                    await sendSimpleEmail(patient_email, 'Appointment Cancelled', patientEmailContent);
                    await sendSimpleEmail(doctor_email, 'Appointment Cancelled', doctorEmailContent);
                } catch (emailError) {
                    console.log('Email sending failed:', emailError);
                    // Don't fail the cancellation if email fails
                }
            }

            res.send({ 
                success: true, 
                message: 'Appointment cancelled successfully' 
            });

        } catch (error) {
            console.error('Error cancelling appointment:', error);
            res.status(500).send({ 
                success: false, 
                message: 'Failed to cancel appointment',
                error: error.message 
            });
        }
    });

    // Update patient profile
    Router.put('/update-profile', async (req, res) => {
        try {
            const { email, name, age, sex, username } = req.body;

            // Validate required fields
            if (!email) {
                return res.status(400).send({ 
                    success: false, 
                    message: 'Email is required' 
                });
            }

            // Find and update the patient
            const updatedPatient = await Patient.findOneAndUpdate(
                { email: email },
                { 
                    name: name,
                    age: age,
                    sex: sex,
                    username: username
                },
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedPatient) {
                return res.status(404).send({ 
                    success: false, 
                    message: 'Patient not found' 
                });
            }

            res.send({ 
                success: true, 
                message: 'Profile updated successfully',
                patient: updatedPatient
            });

        } catch (error) {
            console.error('Error updating patient profile:', error);
            res.status(500).send({ 
                success: false, 
                message: 'Failed to update profile',
                error: error.message 
            });
        }
    });

    return Router
}