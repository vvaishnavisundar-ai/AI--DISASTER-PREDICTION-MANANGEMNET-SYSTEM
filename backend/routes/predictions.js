const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const { protect, admin } = require('../middleware/authMiddleware');
const axios = require('axios'); // for calling ML microservice

// @route   GET /api/predictions
// @desc    Get all predictions
// @access  Public
router.get('/', async (req, res) => {
    try {
        const predictions = await Prediction.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: predictions.length, data: predictions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/predictions
// @desc    Create a prediction (Calls ML microservice)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        // Call the Python FastAPI microservice using Env Variable for production
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
        const mlResponse = await axios.post(`${mlServiceUrl}/predict`, {
            date: new Date().toISOString().split('T')[0],
            disaster_type: req.body.disasterType,
            temperature: req.body.temperature || 30,
            rainfall: req.body.rainfall || 0,
            humidity: req.body.humidity || 50,
            wind_speed: req.body.windSpeed || 10,
            air_pressure: req.body.pressure || 1010,
            population_density: 500, // Default/Mock value for now
            region: req.body.region,
            soil_moisture: 50, // Default/Mock value for now
            river_water_level: 5 // Default/Mock value for now
        });
        
        const predictionData = {
            ...req.body,
            prediction: mlResponse.data.status,
            severity: mlResponse.data.severity,
            probability: mlResponse.data.probability
        };

        const prediction = await Prediction.create(predictionData);

        // Emit socket event to notify clients of new prediction/alert
        if (req.io) {
            req.io.emit('new_prediction', prediction);
        }

        res.status(201).json({ success: true, data: prediction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
