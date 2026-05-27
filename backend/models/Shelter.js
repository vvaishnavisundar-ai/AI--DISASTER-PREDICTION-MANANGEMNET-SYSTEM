const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    currentOccupants: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Open', 'Full', 'Closed'],
        default: 'Open'
    },
    facilities: [String],
    contactNumber: String
}, { timestamps: true });

module.exports = mongoose.model('Shelter', shelterSchema);
