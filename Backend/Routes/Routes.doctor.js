const express = require('express')
const Router = express.Router()

module.exports = (models) => {
    const { Doctor, Patient, BookingDetails } = models;
    let date = new Date(); // Current date and time
    // const newdate = new Date();
    // date.setDate(date.getDate() + 1);
    const dateString = date.toISOString().split('T')[0]
    console.log(date)
    // let sql=`SELECT * from booking_details WHERE date_of_appointment<'${dateString}';`
    // conn.query(sql,(error,result)=>{
    //     if(error) console.log(error)
    //     let sql=`INSERT INTO previous_records VALUES (?)`
    //     result.map((res)=>{
    //         conn.query(sql,[Object.values(res)],(error,result)=>{
    //             if(error) console.log(error)
    //             console.log(result)
    //         })
    //     })
    // })

    Router.post('/', async (req, res) => {
        try {
            const nextWeek = new Date();
            nextWeek.setDate(date.getDate() + 7);
            const nextWeekString = nextWeek.toISOString().split('T')[0];
            const { email } = req.body;

            // Get doctor's timeslot information
            const doctor = await Doctor.findOne({ email: email })
                .select('timeslot_start timeslot_end');
            
            if (!doctor) {
                return res.status(400).send({ error: 'Doctor not found' });
            }

            // Initialize slots array for 7 days
            let final_slots = [];
            for (let i = 0; i < 7; i++) {
                final_slots.push(new Array(doctor.timeslot_end - doctor.timeslot_start)
                    .fill({ status: false, content: {} }));
            }

            // Get booked slots for the next week
            const startDate = new Date(date);
            startDate.setUTCHours(0, 0, 0, 0);
            const endDate = new Date(nextWeek);
            endDate.setUTCHours(23, 59, 59, 999);

            const bookings = await BookingDetails.find({
                doctor_email: email,
                date_of_appointment: {
                    $gte: startDate,
                    $lte: endDate
                }
            });

            // Mark booked slots
            bookings.forEach((booking) => {
                const bookingDate = new Date(booking.date_of_appointment);
                bookingDate.setUTCHours(0, 0, 0, 0);
                const dayDiff = Math.floor((bookingDate - startDate) / (1000 * 60 * 60 * 24));
                
                if (dayDiff >= 0 && dayDiff < 7) {
                    final_slots[dayDiff][booking.slot_booked] = {
                        status: true,
                        content: {
                            patient_email: booking.patient_email,
                            date: booking.date_of_appointment,
                            slot: booking.slot_booked
                        }
                    };
                }
            });

            res.send({ 
                slots: final_slots, 
                start_time: doctor.timeslot_start 
            });
        } catch (error) {
            console.log(error);
            res.status(400).send({ error: error.message });
        }
    })

    Router.post('/get-patient', async (req, res) => {
        try {
            const { patient_email } = req.body;
            
            const patient = await Patient.findOne({ email: patient_email })
                .select('name email age sex');
            
            if (!patient) {
                return res.status(400).send({ error: 'Patient not found' });
            }
            
            res.send(patient);
        } catch (error) {
            console.log(error);
            res.status(400).send({ error: error.message });
        }
    })
    Router.post('/booking-history', async (req, res) => {
        try {
            const { doctor_email } = req.body;
            
            // Get doctor's timeslot_start for calculating actual slot time
            const doctor = await Doctor.findOne({ email: doctor_email })
                .select('timeslot_start');
            
            if (!doctor) {
                return res.status(400).send({ error: 'Doctor not found' });
            }
            
            // Get all bookings for this doctor
            const bookings = await BookingDetails.find({ doctor_email: doctor_email })
                .sort({ date_of_appointment: -1 });
            
            const bookingHistory = [];
            
            // Get patient details for each booking
            for (let booking of bookings) {
                const patient = await Patient.findOne({ email: booking.patient_email })
                    .select('name email age sex');
                
                if (patient) {
                    bookingHistory.push({
                        ...patient.toObject(),
                        date_of_appointment: booking.date_of_appointment,
                        slot_booked: booking.slot_booked + doctor.timeslot_start
                    });
                }
            }
            
            res.send(bookingHistory);
        } catch (error) {
            console.log(error);
            res.status(400).send({ error: error.message });
        }
    })

    Router.post('/update-profile', async (req, res) => {
        try {
            const { username, email, qualification, specialisation, fees, location } = req.body;

            const updatedDoctor = await Doctor.findOneAndUpdate(
                { email: email },
                {
                    username: username,
                    qualification: qualification,
                    specialisation: specialisation,
                    fees: fees,
                    location: location
                },
                { new: true, select: '-password' }
            );

            if (!updatedDoctor) {
                return res.status(400).send({ status: false, message: 'Doctor not found' });
            }

            res.send({ 
                status: true, 
                doctor: updatedDoctor,
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


    return Router
}