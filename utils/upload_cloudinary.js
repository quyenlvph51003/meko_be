import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloundinary.js';
const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'upload_images',
        allowed_formats:['jpg','png','jpeg','gif']
    }
})
const upload=multer({storage}); 
export default upload;
