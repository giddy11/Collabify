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

// Set up the PORT
const PORT = process.env.PORT || 3000;

const app = express();

// Set up middleware
app.use(cors(corsOptions));
app.use(cookieParser()); 
app.use(express.json());

// Connect to MongoDB
connectDB();

// User Routes
const userRoutes = require('./routes/userRoutes');

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Use user routes under '/api/auth'
app.use('/api/auth', userRoutes);

// Create an HTTP server and pass the Express app to it
const server = http.createServer(app);

// Start the server
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
