const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database (Server start is deferred until connection)
const startServer = async () => {
    await connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Make io accessible to routers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const alertRoutes = require('./routes/alerts');
const predictionRoutes = require('./routes/predictions');
const dashboardRoutes = require('./routes/dashboard');
const emergencyRoutes = require('./routes/emergency');
const shelterRoutes = require('./routes/shelters');
const newsRoutes = require('./routes/news');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
    res.send('ScareyChh API is running...');
});

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`Socket Disconnected: ${socket.id}`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
};

startServer();
