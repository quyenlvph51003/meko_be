require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const logger = require('./middlewares/logger');
const {testConnection}=require('./config/db');
const {notFoundResponse,errorResponse}=require('./utils/response_utils');

const app = express();


const port =3000;


const authRoute=require('./module/auth/auth.route');
const userRoute=require('./module/users/user.route');
const provinceRoute=require('./module/address/provinces/province.route');
const wardRoute=require('./module/address/wards/ward.route');
testConnection();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/province',provinceRoute);
app.use('/api/ward',wardRoute);
// Example route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Meko API' });
});

app.use((req,res,next)=>{
    notFoundResponse(res,'Đường dẫn api không tồn tại');
});

app.use((err,req,res,next)=>{
    console.error(err.stack);
    errorResponse(res,'Lỗi máy chủ nội bộ',500,err);
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
