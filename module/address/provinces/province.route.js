import express from 'express';
const router=express.Router();  
import provinceController from '../provinces/province.controller.js';
import authMiddleware from '../../../middlewares/authenticate.js';

router.get('/get-all',authMiddleware.authenticate,provinceController.getProvinces);
router.get('/get-by-code/:code',authMiddleware.authenticate,provinceController.getProvinceByCode);
export default router;
