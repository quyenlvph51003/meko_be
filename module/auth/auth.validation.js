const {isValidEmail}=require('../../utils/validate_utils');
const {validationErrorResponse}=require('../../utils/response_utils');
const AuthRepository = require('./auth.repository');

const validateRegister=async(req,res,next)=>{

    const {email,password,username}=req.body;
    const existsUser=await AuthRepository.findByEmailAuthRepo(email);

    
      if (!email) {
        return validationErrorResponse(res, 'Email không được để trống');
      }
      if (!isValidEmail(email)) {
        return validationErrorResponse(res, 'Email không hợp lệ');
      }
      if(existsUser){
        return validationErrorResponse(res, 'Email đã tồn tại');
      }

      if (!password || password.length<6) {
        return validationErrorResponse(res, 'Mật khẩu không được để trống và phải có ít nhất 6 ký tự');
      }
      if (!username) {
        return validationErrorResponse(res, 'Tên không được để trống');
      }

    next();
}
const validateLogin = async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email){
        return validationErrorResponse(res,'Email không được để trống');
    }
    if(!isValidEmail(email)){
        return validationErrorResponse(res,'Email không hợp lệ');
    }
    if(!password){
        return validationErrorResponse(res,'Mật khẩu không được để trống');
    }
    
    next();
}

const validateRefreshToken = async(req,res,next)=>{
  const {refreshToken,email}=req.body;
  if(!refreshToken){
    return validationErrorResponse(res,'Refresh token không được để trống');
  }
  if(!email){
    return validationErrorResponse(res,'Email không được để trống');
  }
  if(!isValidEmail(email)){
    return validationErrorResponse(res,'Email không hợp lệ');
  }
  next();
}

const validateRequestOtp=async(req,res,next)=>{
    const {email}=req.body;

    if(!email){
        return validationErrorResponse(res,'Email không được để trống');
    }
    if(!isValidEmail(email)){
        return validationErrorResponse(res,'Email không hợp lệ');
    }
    next();
}

const validateVerifyOtp=async(req,res,next)=>{
    const {email,otp}=req.body;
    if(!email){
        return validationErrorResponse(res,'Email không được để trống');
    }
    if(!isValidEmail(email)){
        return validationErrorResponse(res,'Email không hợp lệ');
    }
    if(!otp){
        return validationErrorResponse(res,'Mã OTP không được để trống');
    }
    next();
}

const validateChangePass=async(req,res,next)=>{
  const {email,passwordOld,passwordNew}=req.body;
  if(!email){
    return validationErrorResponse(res,'Email không được để trống');
  }
  if(!isValidEmail(email)){
    return validationErrorResponse(res,'Email không hợp lệ');
  }
  if(!passwordOld){
    return validationErrorResponse(res,'Mật khẩu cũ không được để trống');
  }
  if(!passwordNew){
    return validationErrorResponse(res,'Mật khẩu mới không được để trống');
  }
  next();
}

module.exports={validateRegister,validateLogin,validateRefreshToken,validateRequestOtp,validateVerifyOtp,validateChangePass}
