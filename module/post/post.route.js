const express=require('express');
const router=express.Router();
const {createPostController,getDetailByPostIdController,updatePostByIdController}=require('./post.controller');
const {validatonCreatePost,validationUpdatePost}=require('./post.validation');
const {authenticate}=require('../../middlewares/authenticate');
const upload=require('../../utils/upload_cloudinary');

router.post('/create',authenticate,upload.array('images'),validatonCreatePost,createPostController);
router.get('/detail/:postId',getDetailByPostIdController);
router.put('/update',authenticate,upload.array('images'),validationUpdatePost,updatePostByIdController);
module.exports=router;
