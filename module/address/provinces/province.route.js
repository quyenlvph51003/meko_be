const express=require('express');
const router=express.Router();
const provinceController=require('../provinces/province.controller');
const authMiddleware=require('../../../middlewares/authenticate');

router.get('/get-all',authMiddleware.authenticate,provinceController.getProvinces);
router.get('/get-by-code/:code',authMiddleware.authenticate,provinceController.getProvinceByCode);
module.exports=router;
