var nodemailer = require('nodemailer');

// Function for appointment confirmation emails
function sendMail(patient_email, doctor_email, date_of_appointment, slot_booked, doc_name, doc_location) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSKEY
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_ID,
        to: patient_email,
        subject: 'Who\'s My Doc :: Doctor Appointment Confirmed',

        html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px;">

        <h2 style="color: #007bff;">Appointment Confirmation</h2>
        
        <p><strong>Doctor Name:</strong> <span style="color: #28a745;">${doc_name}</span></p>
        <p><strong>Doctor Email:</strong> <span style="color: #28a745;">${doctor_email}</span></p>
        <p><strong>Date of Appointment:</strong> <span style="color: #28a745;">${date_of_appointment}</span></p>
        <p><strong>Slot Booked:</strong> <span style="color: #28a745;">${slot_booked}:00 Hr.</span></p>
        <p><strong>Doctor Location:</strong> <span style="color: #28a745;">${doc_location}</span></p>
        <p style="margin-top: 20px;">Thank you for scheduling an appointment. We look forward to seeing you.</p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
                Best regards,<br>
                Who's My Doc Team
            </p>
        </div>
        
        </body>`
    };

    return transporter.sendMail(mailOptions);
}

// Function for simple emails (cancellation, etc.)
function sendSimpleEmail(to, subject, content) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSKEY
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_ID,
        to: to,
        subject: subject,
        html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            ${content}
        </div>
        </body>`
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendMail, sendSimpleEmail };