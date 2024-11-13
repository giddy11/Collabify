// set up the dotenv
const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors')
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const corsOptions = require('./config/corsOptions')

//set up the PORT
const PORT = process.env.PORT || 3000;
const express = require("express");
var cookieParser = require('cookie-parser');

// set up express
const app = express();
app.use(cors(corsOptions))
app.use(cookieParser()); 
app.use(express.json());

connectDB()

// User Routes
const userRoutes = require('./routes/userRoutes');

//learner Route
const learnerRoutes = require('./routes/learnerRoutes');

app.use('/api/auth', userRoutes);
app.use('/api', learnerRoutes);



//connect to database
mongoose.connection.once('open', () => {
    console.log("Connect to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});