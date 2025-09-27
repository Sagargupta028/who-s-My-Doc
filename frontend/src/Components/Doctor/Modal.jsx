import React from 'react'

export default function Modal({patientdetails}) {
    console.log(patientdetails)
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
                           <p>Name: {patientdetails['name']}</p>
                           <p>Email: {patientdetails.email}</p>
                           <p>Age: {patientdetails.age}</p>
                           <p>Sex: {patientdetails.sex}</p>
                           <p>Date of appointment: {patientdetails.date}</p>
                           <p>Slot Booked: {patientdetails.slot}</p>

                           {/* {console.log(patientdetails)} */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
