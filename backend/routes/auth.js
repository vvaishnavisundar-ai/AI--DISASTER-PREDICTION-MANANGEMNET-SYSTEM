const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'client'
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate a user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get user data
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// @route   PUT /api/auth/profile
// @desc    Update user profile (password and locations)
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const updateData = {};
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.savedLocations) updateData.savedLocations = req.body.savedLocations;

        if (req.body.password) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(req.body.password, salt);
        }

        const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            savedLocations: user.savedLocations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/users', protect, async (req, res) => {
    try {
        // if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Not authorized as admin' });
        const users = await User.find({}).sort({ createdAt: -1 }).select('-password');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/auth/users/:id
// @desc    Update user role (Admin only)
// @access  Private/Admin
router.put('/users/:id', protect, async (req, res) => {
    try {
        // if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Not authorized as admin' });
        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/auth/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/users/:id', protect, async (req, res) => {
    try {
        // if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Not authorized as admin' });
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
