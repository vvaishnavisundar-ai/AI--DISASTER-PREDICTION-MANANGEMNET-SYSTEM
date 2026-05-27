const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/news
// @desc    Get all news
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: news.length, data: news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/news
// @desc    Create a news update
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const news = await News.create(req.body);
        res.status(201).json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
