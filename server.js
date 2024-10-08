require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectDB = require('./config/db');
 const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(cors());
// Routes
app.use('/api', require('./routes/adminRoutes'));
app.use('/api', require('./routes/products'));
app.use('/api', require('./routes/cartRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/paymentsRoutes'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
