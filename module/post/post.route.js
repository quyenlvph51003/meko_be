const express=require('express');
const router=express.Router();
const {createPostController}=require('./post.controller');
const {validatonCreatePost}=require('./post.validation');
const {authenticate}=require('../../middlewares/authenticate');
const upload=require('../../utils/upload_cloudinary');

router.post('/create',authenticate,upload.array('images'),validatonCreatePost,createPostController);

module.exports=router;
