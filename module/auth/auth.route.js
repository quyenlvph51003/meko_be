import express from 'express';
const router=express.Router();
import authController from './auth.controller.js';
import Validate from './auth.validation.js';


router.post('/register',Validate.validateRegister,authController.register);
router.post('/login',Validate.validateLogin,authController.login);
router.post('/refresh-token',Validate.validateRefreshToken,authController.refreshToken);
router.post('/request-otp',Validate.validateRequestOtp,authController.requestOtp);
router.post('/verify-otp',Validate.validateVerifyOtp,authController.verifyOtp);
router.put('/change-password',Validate.validateChangePass,authController.changePassController);
router.put('/forgot-password',Validate.validateForgotPass,authController.forgotPassController);
export default router;

