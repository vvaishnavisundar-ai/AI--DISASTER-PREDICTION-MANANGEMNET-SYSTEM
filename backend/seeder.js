require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Alert = require('./models/Alert');
const Prediction = require('./models/Prediction');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();
    try {
        // Clear existing data
        await Alert.deleteMany();
        await Prediction.deleteMany();

        // Add 5 realistic predictions
        const pastPredictions = [
            {
                date: new Date(Date.now() - 400000000),
                disasterType: 'Flood',
                temperature: 28,
                rainfall: 150,
                humidity: 90,
                windSpeed: 20,
                pressure: 1005,
                region: 'Mumbai',
                prediction: 'Alert',
                severity: 'Warning',
                probability: 65,
                createdAt: new Date(Date.now() - 400000000)
            },
            {
                date: new Date(Date.now() - 300000000),
                disasterType: 'Cyclone',
                temperature: 30,
                rainfall: 50,
                humidity: 85,
                windSpeed: 120,
                pressure: 980,
                region: 'Kolkata',
                prediction: 'Evacuate',
                severity: 'Critical',
                probability: 92,
                createdAt: new Date(Date.now() - 300000000)
            },
            {
                date: new Date(Date.now() - 200000000),
                disasterType: 'Earthquake',
                temperature: 25,
                rainfall: 0,
                humidity: 40,
                windSpeed: 10,
                pressure: 1012,
                region: 'Delhi',
                prediction: 'Safe',
                severity: 'Low',
                probability: 15,
                createdAt: new Date(Date.now() - 200000000)
            },
            {
                date: new Date(Date.now() - 100000000),
                disasterType: 'Wildfire',
                temperature: 42,
                rainfall: 0,
                humidity: 15,
                windSpeed: 35,
                pressure: 1010,
                region: 'Rajasthan',
                prediction: 'Alert',
                severity: 'Warning',
                probability: 70,
                createdAt: new Date(Date.now() - 100000000)
            },
            {
                date: new Date(),
                disasterType: 'Flood',
                temperature: 27,
                rainfall: 300,
                humidity: 95,
                windSpeed: 45,
                pressure: 995,
                region: 'Chennai',
                prediction: 'Evacuate',
                severity: 'Critical',
                probability: 98,
                createdAt: new Date()
            }
        ];

        await Prediction.insertMany(pastPredictions);

        // Add 5 realistic alerts
        const activeAlerts = [
            {
                title: 'Severe Cyclone Warning',
                message: 'Category 3 cyclone approaching the eastern coast. High wind speeds detected.',
                severity: 'Critical',
                region: 'Kolkata',
                timestamp: new Date()
            },
            {
                title: 'Flash Flood Risk',
                message: 'Heavy continuous rainfall has elevated river levels beyond safe thresholds.',
                severity: 'Critical',
                region: 'Chennai',
                timestamp: new Date()
            },
            {
                title: 'High Heatwave Watch',
                message: 'Temperatures exceeding 40°C expected for the next 48 hours. Stay hydrated.',
                severity: 'Warning',
                region: 'Rajasthan',
                timestamp: new Date()
            },
            {
                title: 'Minor Seismic Activity',
                message: 'Magnitude 3.2 tremor recorded. No structural damage reported yet.',
                severity: 'Info',
                region: 'Delhi',
                timestamp: new Date()
            },
            {
                title: 'Heavy Rainfall Alert',
                message: 'Water logging expected in low lying areas over the next 12 hours.',
                severity: 'Warning',
                region: 'Mumbai',
                timestamp: new Date()
            }
        ];

        await Alert.insertMany(activeAlerts);

        console.log('Database successfully seeded with 5 Predictions and 5 Alerts!');
        process.exit();
    } catch (error) {
        console.error(`Seed Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
