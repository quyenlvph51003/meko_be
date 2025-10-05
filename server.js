require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const logger = require('./middlewares/logger');
const {testConnection}=require('./config/db');
const app = express();
const port =3000;


const authRoute=require('./module/auth/auth.route');

testConnection();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth',authRoute);


// Example route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Meko API' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});


module.exports = app;
