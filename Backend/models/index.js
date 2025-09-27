// Export all models from a single file for easier imports
const Doctor = require('./Doctor');
const Patient = require('./Patient');
const BookingDetails = require('./BookingDetails');

module.exports = {
    Doctor,
    Patient,
    BookingDetails
};
