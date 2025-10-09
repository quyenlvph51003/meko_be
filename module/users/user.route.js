const express=require('express');
const router=express.Router();
const {createUserValidation,updateUserValidation,searchUserValidation}=require('./user.validation');
const userController=require('./user.controller');
const upload=require('../../utils/upload_cloudinary');

router.post('/create',createUserValidation,userController.createUser);
router.get('/detail/:id',userController.getDetailUser);
router.put('/upload-avatar/:id',upload.single('avatar'),userController.uploadAvatar);
router.put('/update-user',updateUserValidation,userController.updateUserController);
router.get('/search',searchUserValidation,userController.searchUserController);
module.exports=router;