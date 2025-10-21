import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import logger from './middlewares/logger.js';
import testConnection from './config/db.js';
import response_utils from './utils/response_utils.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

const port =3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Thư mục chứa file .ejs

// ✨ [2] Cấu hình phục vụ file tĩnh (CSS, JS, ảnh,...)
app.use(express.static(path.join(__dirname, 'public')));

import authRoute from './module/auth/auth.route.js';
import userRoute from './module/users/user.route.js';
import provinceRoute from './module/address/provinces/province.route.js';
import wardRoute from './module/address/wards/ward.route.js';
import postRoute from './module/post/post.route.js';
import categoryRoute from './module/category/category.route.js';  
import webRoute from './routes/web.routes.js';
testConnection.testConnection();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/province',provinceRoute);
app.use('/api/ward',wardRoute);
app.use('/api/post',postRoute);
app.use('/api/category',categoryRoute);
app.use('/admin', webRoute);

app.use((req,res,next)=>{
    response_utils.notFoundResponse(res,'Đường dẫn api không tồn tại');
});

app.use((err,req,res,next)=>{
    console.error(err.stack);
    response_utils.errorResponse(res,'Lỗi máy chủ nội bộ',500,err);
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

export default app;
