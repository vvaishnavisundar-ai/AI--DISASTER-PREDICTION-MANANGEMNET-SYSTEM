const express = require('express');
const router = express.Router();
const Shelter = require('../models/Shelter');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/shelters
// @desc    Get all shelters (Public)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const shelters = await Shelter.find();
        res.status(200).json({ success: true, count: shelters.length, data: shelters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/shelters
// @desc    Create a new shelter
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const shelter = await Shelter.create(req.body);
        res.status(201).json({ success: true, data: shelter });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/shelters/:id
// @desc    Update a shelter
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!shelter) return res.status(404).json({ success: false, message: 'Shelter not found' });
        res.status(200).json({ success: true, data: shelter });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/shelters/:id
// @desc    Delete a shelter
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const shelter = await Shelter.findByIdAndDelete(req.params.id);
        if (!shelter) return res.status(404).json({ success: false, message: 'Shelter not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
