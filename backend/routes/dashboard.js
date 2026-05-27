const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/dashboard/client
// @desc    Get data for the Client Dashboard (Weather, AQI, Risks)
// @access  Private
router.get('/client', protect, (req, res) => {
    // In a production app, this would query a real weather API like OpenWeatherMap
    // and aggregate real active predictions from the MongoDB.
    // For this prototype, we return the data required to match the Enterprise Mockup.
    
    res.json({
        success: true,
        data: {
            topCards: {
                riskLevel: {
                    status: 'High',
                    message: 'Take Precautions',
                    color: 'text-red-500'
                },
                weather: {
                    temp: '28°C',
                    condition: 'Heavy Rainfall',
                    icon: 'cloud-rain'
                },
                airQuality: {
                    aqi: 'AQI 42',
                    status: 'Good',
                    color: 'text-green-500'
                },
                location: {
                    city: 'Guwahati, Assam',
                    country: 'India'
                }
            },
            riskProbabilities: [
                { type: 'Flood Risk', level: 'High', probability: 80, color: 'text-red-500', bg: 'bg-red-500/10' },
                { type: 'Cyclone Risk', level: 'Medium', probability: 45, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { type: 'Earthquake Risk', level: 'Low', probability: 20, color: 'text-green-500', bg: 'bg-green-500/10' },
                { type: 'Heatwave Risk', level: 'Medium', probability: 40, color: 'text-orange-500', bg: 'bg-orange-500/10' }
            ]
        }
    });
});

module.exports = router;
