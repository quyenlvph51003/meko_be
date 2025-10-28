import express from 'express';
const router=express.Router();
import CategoryController from './category.controller.js';
import Middleware from '../../middlewares/authenticate.js';
import upload from '../../utils/upload_cloudinary.js';

router.post('/create',Middleware.authenticate,upload.single('avatar'),CategoryController.createCategoryController);
router.put('/update/:id',Middleware.authenticate,upload.single('avatar'),CategoryController.updateCategoryController);
router.get('/detail/:id',CategoryController.getDetailCategoryController);
router.get('/list',CategoryController.getListCategoryController);
router.get('/search',Middleware.authenticate,CategoryController.searchCategoryController);
router.put('/update-is-active/:id',Middleware.authenticate,CategoryController.updateIsActiveController);
export default router;