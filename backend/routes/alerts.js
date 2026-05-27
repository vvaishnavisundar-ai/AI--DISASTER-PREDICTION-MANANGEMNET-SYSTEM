const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/alerts
// @desc    Get all active alerts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ timestamp: -1 });
        res.status(200).json({ success: true, count: alerts.length, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/alerts
// @desc    Create an alert and broadcast
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const alert = await Alert.create(req.body);

        // Broadcast alert to all connected clients
        if (req.io) {
            req.io.emit('emergency_alert', alert);
        }

        res.status(201).json({ success: true, data: alert });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
