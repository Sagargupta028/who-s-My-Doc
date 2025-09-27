const express = require('express')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config();
const prdictionRouter = require('./Routes/Routes.prediction.js')

const cors = require('cors')
const port = process.env.PORT || 3000

const loginRouter = require('./Routes/Routes.login')
const registerRouter = require('./Routes/Routes.register')
const patientRoute = require('./Routes/Routes.patient.js')
const doctorRoute = require('./Routes/Routes.doctor.js')
process.env.TZ = 'IST';

// Import models
const { Doctor, Patient, BookingDetails } = require('./models');

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cors())

// Root route for health check
app.get('/', (req, res) => {
    res.json({ 
        message: "Who's My Doc API is running!", 
        status: "success",
        timestamp: new Date().toISOString(),
        endpoints: {
            login: "/login",
            register: "/register", 
            patient: "/patient",
            doctor: "/doctor",
            prediction: "/prediction"
        }
    });
});

// API health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString()
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log('App listening on port: ', port)
    })
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

// Pass models to routes instead of connection
const models = { Doctor, Patient, BookingDetails };

app.use('/login', loginRouter(models))
app.use('/register', registerRouter(models))
app.use('/patient', patientRoute(models))
app.use('/doctor', doctorRoute(models))
app.use('/prediction', prdictionRouter(models))

// Handle 404 for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: "Route not found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: [
            "GET /",
            "GET /health", 
            "POST /login",
            "POST /register",
            "POST /patient/*",
            "POST /doctor/*",
            "POST /prediction/*"
        ]
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: "Internal server error",
        message: err.message || "Something went wrong!"
    });
});





// conn.end((err) => {
//     if (err) {
//         console.error('Error closing MySQL connection:', err);
//         return;
//     }
//     console.log('MySQL connection closed');
// });
// app.use('/maiddetails',MaidRouter(conn))
// app.use('/',UserRouter(conn))