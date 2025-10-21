import express from 'express';
const router=express.Router();
import wardController from '../wards/ward.controller.js';
import authMiddleware from '../../../middlewares/authenticate.js';

router.get('/get-all',authMiddleware.authenticate,wardController.getWards);
router.get('/get-by-code/:code',authMiddleware.authenticate,wardController.getWardByCode);
router.get('/get-by-province-code',authMiddleware.authenticate,wardController.getWardsByProvinceCode);
export default router;
