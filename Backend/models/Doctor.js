const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    qualification: {
        type: String,
        required: true,
        trim: true
    },
    specialisation: {
        type: String,
        required: true,
        trim: true
    },
    fees: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    timeslot_start: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    timeslot_end: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    review: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    count: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Index for better query performance (email index is already created by unique: true)
doctorSchema.index({ specialisation: 1, location: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
