const mongoose = require('mongoose');

const bookingDetailsSchema = new mongoose.Schema({
    patient_email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    doctor_email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    date_of_appointment: {
        type: Date,
        required: true
    },
    slot_booked: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    status: {
        type: String,
        enum: ['booked', 'completed', 'cancelled'],
        default: 'booked'
    },
    booking_date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better query performance
bookingDetailsSchema.index({ patient_email: 1 });
bookingDetailsSchema.index({ doctor_email: 1 });
bookingDetailsSchema.index({ date_of_appointment: 1 });
bookingDetailsSchema.index({ doctor_email: 1, date_of_appointment: 1 });

// Compound unique index to prevent double booking
bookingDetailsSchema.index({ 
    doctor_email: 1, 
    date_of_appointment: 1, 
    slot_booked: 1 
}, { unique: true });

module.exports = mongoose.model('BookingDetails', bookingDetailsSchema);
