const express=require('express');
const router=express.Router();
const authController=require('./auth.controller');
const {
    validateRegister,
    validateLogin,
    validateRefreshToken,
    validateRequestOtp,
    validateVerifyOtp,
    validateChangePass
}=require('./auth.validation');


router.post('/register',validateRegister,authController.register);
router.post('/login',validateLogin,authController.login);
router.post('/refresh-token',validateRefreshToken,authController.refreshToken);
router.post('/request-otp',validateRequestOtp,authController.requestOtp);
router.post('/verify-otp',validateVerifyOtp,authController.verifyOtp);
router.put('/change-password',validateChangePass,authController.changePassController);

module.exports=router;

