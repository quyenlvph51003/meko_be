const {CloudinaryStorage}=require('multer-storage-cloudinary');
const multer=require('multer');
const cloudinary=require('../config/cloundinary');
const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'upload_images',
        allowed_formats:['jpg','png','jpeg','gif']
    }
})
const upload=multer({storage});
module.exports=upload;
