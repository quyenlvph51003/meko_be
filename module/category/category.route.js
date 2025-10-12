const express=require('express');
const router=express.Router();
const {createCategoryController,updateCategoryController,getDetailCategoryController,getListCategoryController}=require('./category.controller');
const {authenticate}=require('../../middlewares/authenticate');
const upload=require('../../utils/upload_cloudinary');

router.post('/create',authenticate,upload.single('avatar'),createCategoryController);
router.put('/update/:id',authenticate,upload.single('avatar'),updateCategoryController);
router.get('/detail/:id',getDetailCategoryController);
router.get('/list',getListCategoryController);
module.exports=router;