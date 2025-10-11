const express=require('express');
const router=express.Router();
const wardController=require('../wards/ward.controller');
const authMiddleware=require('../../../middlewares/authenticate');

router.get('/get-all',authMiddleware.authenticate,wardController.getWards);
router.get('/get-by-code/:code',authMiddleware.authenticate,wardController.getWardByCode);
router.get('/get-by-province-code',authMiddleware.authenticate,wardController.getWardsByProvinceCode);
module.exports=router;
