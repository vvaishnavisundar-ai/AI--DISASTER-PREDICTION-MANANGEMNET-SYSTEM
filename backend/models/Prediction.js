const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    disasterType: {
        type: String,
        required: true,
        enum: ['Flood', 'Earthquake', 'Cyclone', 'Wildfire']
    },
    temperature: Number,
    rainfall: Number,
    humidity: Number,
    windSpeed: Number,
    pressure: Number,
    prediction: {
        type: String,
        required: true, // e.g., 'Safe', 'Warning', 'Danger'
    },
    severity: {
        type: String,
        required: true, // e.g., 'Low', 'Medium', 'High', 'Critical'
    },
    probability: {
        type: Number,
        required: true // Percentage 0-100
    },
    region: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Resolved']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prediction', predictionSchema);
