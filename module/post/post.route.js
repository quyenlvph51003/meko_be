import express from 'express';
const router=express.Router();
import PostController from './post.controller.js';
import PostValidation from './post.validation.js';
import Middleware from '../../middlewares/authenticate.js';
import upload from '../../utils/upload_cloudinary.js';

router.post('/create',Middleware.authenticate,upload.array('images'),PostValidation.validatonCreatePost,PostController.createPostController);
router.get('/detail/:postId',PostController.getDetailByPostIdController);
router.put('/update',Middleware.authenticate,upload.array('images'),PostValidation.validationUpdatePost,PostController.updatePostByIdController);
export default router;
