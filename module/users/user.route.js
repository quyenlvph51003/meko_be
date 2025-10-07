const express=require('express');
const router=express.Router();
const {createUserValidation}=require('./user.validation');
const userController=require('./user.controller');
const upload=require('../../utils/upload_cloudinary');

router.post('/create',createUserValidation,userController.createUser);
router.get('/detail/:id',userController.getDetailUser);
router.post('/upload-avatar/:id',upload.single('avatar'),userController.uploadAvatar);
module.exports=router;