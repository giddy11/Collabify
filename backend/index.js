// Load environment variables
const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors');
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const corsOptions = require('./config/corsOptions');
const express = require("express");
const cookieParser = require('cookie-parser');
const http = require('http');
// Auth Routes
const authRoutes = require('./routes/authRoutes');

// User Routes
const userRoutes = require('./routes/userRoutes');

// Set up the PORT
const PORT = process.env.PORT || 3000;
const app = express();
// Create an HTTP server and pass the Express app to it
const server = http.createServer(app);

// Set up middleware
app.use(cors(corsOptions));
app.use(cookieParser()); 
app.use(express.json());

// Connect to MongoDB
connectDB();

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// routes'
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

// Start the server
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});