const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const Alert = require('../models/Alert');
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
            populationDensity: req.body.populationDensity || 500,
            region: req.body.region,
            soilMoisture: req.body.soilMoisture || 50,
            riverWaterLevel: req.body.riverWaterLevel || 5
        });
        
        let finalDisasterType = mlResponse.data.predicted_disaster || req.body.disasterType;
        // Fail-safe: If the Python server hasn't been restarted to include the new logic, prevent Mongoose crash
        if (finalDisasterType === 'Auto-Detect' || finalDisasterType === 'Auto-Detect (AI decides)') {
            finalDisasterType = 'Flood'; 
        }
        
        const predictionData = {
            ...req.body,
            disasterType: finalDisasterType,
            prediction: mlResponse.data.status,
            severity: mlResponse.data.severity,
            probability: mlResponse.data.probability
        };

        const prediction = await Prediction.create(predictionData);

        // Real-Time Automation: If AI flags Critical or Warning, auto-generate an Alert
        if (prediction.severity === 'Critical' || prediction.severity === 'Warning') {
            const newAlert = await Alert.create({
                title: `AI Automated ${prediction.severity} Alert: ${prediction.disasterType}`,
                message: `Automated system detects ${prediction.probability}% probability of ${prediction.disasterType}. Immediate attention required.`,
                severity: prediction.severity,
                region: prediction.region
            });

            // Broadcast via Socket.io
            if (req.io) {
                req.io.emit('emergency_alert', newAlert);
            }
        }

        // Emit socket event to notify clients of new prediction/alert
        if (req.io) {
            req.io.emit('new_prediction', prediction);
        }

        res.status(201).json({ success: true, data: prediction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/predictions/:id
// @desc    Update a prediction (e.g., status to Resolved)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const prediction = await Prediction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!prediction) return res.status(404).json({ success: false, message: 'Prediction not found' });
        res.status(200).json({ success: true, data: prediction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/predictions/:id
// @desc    Delete a prediction
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const prediction = await Prediction.findByIdAndDelete(req.params.id);
        if (!prediction) return res.status(404).json({ success: false, message: 'Prediction not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
