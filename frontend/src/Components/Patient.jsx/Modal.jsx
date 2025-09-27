import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { API_ENDPOINTS } from '../../config/api'

export default function Modal(props) {
    const { doctor_email, patient_email, date_of_appointment, slot_booked, doctor_name, fees, location, timeslot_start } = props.bookingDetails
    let obj = { doctor_email, patient_email, date_of_appointment, slot_booked }
    console.log(obj)
    console.log(timeslot_start, slot_booked)

    const [bookingstatus,setBookingStatus]=useState('')
    const handlebookingconfirmation = async () => {
        try {
            const result = await axios.post(API_ENDPOINTS.PATIENT.BOOK_DOCTOR, obj);
            console.log(result);
            
            if (result.data.status) {
                toast.success('Appointment booked successfully! 🎉');
                props.setBookingDetails({
                    doctor_email: '',
                    patient_email: 'pat1@email',  //later it will be fetched from the context api
                    date_of_appointment: date_of_appointment,
                    slot_booked: 0
                });
                props.refreshpage(new Event('submit', { cancelable: true }));
                const btnclose = document.getElementById('closeconfirm');
                btnclose.click();
            } else {
                toast.error(result.data.message || 'Failed to book appointment. Please try again.');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to book appointment. Please try again.');
        }
        
    }
    // console.log(patientdetails)
    return (
        <>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Patient Details</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Doctor's Name: {doctor_name}</p>
                            <p>Doctor's Email: {doctor_email}</p>
                            <p>Patient Email: {patient_email}</p>

                            <p>Location: {location}</p>
                            <p>Fees: {fees}</p>
                            <p>Date of appointment: {date_of_appointment}</p>
                            <p>Location: {location}</p>
                            <p>Slot: {timeslot_start + slot_booked}:00 - {timeslot_start + slot_booked + 1}:00 </p>


                            {/* {console.log(patientdetails)} */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" id='closeconfirm' data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handlebookingconfirmation}>Confirm booking</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
