import React, { useContext, useState, useEffect } from 'react';
import './DoctorProfile.css';
import img2 from '../../assets/prof-user.jpg';
import { AuthContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Navbar/NavBar';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

export default function DoctorProfile() {
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)
    const doc = isAuthenticated[0] && isAuthenticated[1]
    const [docDetails, setDocDetails] = useState([])
    useEffect(() => {

        if (doc == undefined || doc.type !== 'doctor')
            navigate('/')
        else
            setDocDetails(doc)
    }, [])

    //Modal--------------------------------------------
    const [UpdateEnable, setUpdateEnable] = useState(false);


    const handleCancel = () => {
        setUpdateEnable(false);
    };

    const updateHandler = async () => {
        // console.log(docDetails);
        const data = {
            "username": docDetails.username,
            "email": docDetails.email,
            "qualification": docDetails.qualification,
            "specialisation": docDetails.specialisation,
            "fees": docDetails.fees,
            "location": docDetails.location
        }

        const res = await axios.post(API_ENDPOINTS.DOCTOR.UPDATE_PROFILE, data);
        if (res.data.status) {
            setIsAuthenticated([true, docDetails])
        }
        else {
            console.log(res.data)
        }
    }


    return (
        <>
            <NavBar />
            <section class="vh-100 main-section" style={{ "background-color": "#f4f5f7;" }}>
                <div class="container py-5 h-100">
                    <div class="row d-flex justify-content-center align-items-center h-100">
                        <div class="col d-flex justify-content-center mb-4 mb-lg-0">
                            <div class="card mb-3" style={{ "border-radius": ".5rem;" }}>
                                <div class="row g-0">
                                    <div class="col-md-4 gradient-custom text-center text-white"
                                        style={{ "border-top-left-radius": ".3rem", "border-bottom-left-radius": ".2rem" }}>
                                        <img src={img2}
                                            alt="Avatar" class="img-fluid my-5 rounded-circle" style={{ "width": "150px" }} />
                                        <h5>{doc.name}</h5>

                                        <i class="far fa-edit mb-5"></i>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body p-4">
                                            <h5>Information</h5>
                                            <hr class="mt-0 mb-4" />
                                            <div class="row pt-1">
                                                <div class="col-6 mb-3">
                                                    <h5>Email</h5>
                                                    {
                                                        <p class="text-muted">{doc.email}</p>
                                                    }
                                                </div>
                                                <div class="col-6 mb-3">
                                                    <h5>Username</h5>
                                                    <p class="text-muted">{doc.username}</p>
                                                </div>

                                            </div>
                                            <hr class="mt-0 mb-4" />
                                            <div class="row pt-1">
                                                <div class="col-6 mb-3">
                                                    <h5>Qualification</h5>
                                                    {
                                                        UpdateEnable ? <input name="qualification" type="text" class="text-muted" value={docDetails.qualification} onChange={(e) => { setDocDetails((docDet) => { return { ...docDet, [e.target.name]: e.target.value } }) }} /> :
                                                            <p class="text-muted">{doc.qualification}</p>
                                                    }
                                                </div>
                                                <div class="col-6 mb-3">
                                                    <h5>Specialisation</h5>
                                                    {
                                                        UpdateEnable ? <input name="specialisation" type="text" class="text-muted" value={docDetails.specialisation} onChange={(e) => { setDocDetails((docDet) => { return { ...docDet, [e.target.name]: e.target.value } }) }} /> :
                                                            <p class="text-muted">{doc.specialisation}</p>
                                                    }
                                                </div>

                                            </div>
                                            <hr />
                                            <div class="row pt-1">
                                                <div class="col-4 mb-3">
                                                    <h5>Fees</h5>
                                                    {
                                                        UpdateEnable ? <input name="fees" type="number" class="text-muted" value={docDetails.fees} onChange={(e) => { setDocDetails((docDet) => { return { ...docDet, [e.target.name]: parseInt(e.target.value) } }) }} /> :
                                                            <p class="text-muted">{doc.fees}</p>
                                                    }
                                                </div>
                                                <div class="col-4 mb-3">
                                                    <h5>Location</h5>
                                                    {
                                                        UpdateEnable ? <input name="location" type="text" class="text-muted" value={docDetails.location} onChange={(e) => { setDocDetails((docDet) => { return { ...docDet, [e.target.name]: e.target.value } }) }} /> :
                                                            <p class="text-muted">{doc.location}</p>
                                                    }
                                                </div>
                                                <div class="col-4 mb-3">
                                                    <h5>Timing</h5>
                                                    <p class="text-muted">{doc.timeslot_start}:00 - {doc.timeslot_end}:00</p>
                                                </div>
                                            </div>

                                        </div>
                                        {
                                            UpdateEnable === false ?
                                                <button className='btn btn-primary m-3 mb-0 mt-0' onClick={() => { setUpdateEnable(true); setDocDetails(doc) }}>Edit Details</button> :
                                                <>
                                                    <button className='btn btn-danger m-3 mb-0 mt-0' onClick={() => { setUpdateEnable(false); }}>Cancel</button>
                                                    <button className='btn btn-primary m-3 mb-0 mt-0' onClick={() => { updateHandler(); setUpdateEnable(false); }}>Save Changes</button>
                                                </>

                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
