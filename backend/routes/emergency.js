const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/emergency
// @desc    Get all emergency shelters/resources
// @access  Public
router.get('/', async (req, res) => {
    try {
        const emergencies = await Emergency.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: emergencies.length, data: emergencies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/emergency
// @desc    Add emergency shelter/resource
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const emergency = await Emergency.create(req.body);
        res.status(201).json({ success: true, data: emergency });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
