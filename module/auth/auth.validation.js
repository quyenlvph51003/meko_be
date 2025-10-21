import ValidEmail from '../../utils/validate_utils.js';
import ResponseUtils from '../../utils/response_utils.js';
import AuthRepository from './auth.repository.js';

const validateRegister=async(req,res,next)=>{

    const {email,password,username}=req.body;
    const existsUser=await AuthRepository.findByEmailAuthRepo(email);

    
      if (!email) {
        return ResponseUtils.validationErrorResponse(res, 'Email không được để trống');
      }
      if (!ValidEmail.isValidEmail(email)) {
        return ResponseUtils.validationErrorResponse(res, 'Email không hợp lệ');
      }
      if(existsUser){
        return ResponseUtils.validationErrorResponse(res, 'Email đã tồn tại');
      }

      if (!password || password.length<6) {
        return ResponseUtils.validationErrorResponse(res, 'Mật khẩu không được để trống và phải có ít nhất 6 ký tự');
      }
      if (!username) {
        return ResponseUtils.validationErrorResponse(res, 'Tên không được để trống');
      }

    next();
}
const validateLogin = async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email){
        return ResponseUtils.validationErrorResponse(res,'Email không được để trống');
    }
    if(!ValidEmail.isValidEmail(email)){
        return ResponseUtils.validationErrorResponse(res,'Email không hợp lệ');
    }
    if(!password){
        return ResponseUtils.validationErrorResponse(res,'Mật khẩu không được để trống');
    }
    
    next();
}

const validateRefreshToken = async(req,res,next)=>{
  const {refreshToken,email}=req.body;
  if(!refreshToken){
    return ResponseUtils.validationErrorResponse(res,'Refresh token không được để trống');
  }
  if(!email){
    return ResponseUtils.validationErrorResponse(res,'Email không được để trống');
  }
  if(!ValidEmail.isValidEmail(email)){
    return ResponseUtils.validationErrorResponse(res,'Email không hợp lệ');
  }
  next();
}

const validateRequestOtp=async(req,res,next)=>{
    const {email}=req.body;

    if(!email){
        return ResponseUtils.validationErrorResponse(res,'Email không được để trống');
    }
    if(!ValidEmail.isValidEmail(email)){
        return ResponseUtils.validationErrorResponse(res,'Email không hợp lệ');
    }
    next();
}

const validateVerifyOtp=async(req,res,next)=>{
    const {email,otp}=req.body;
    if(!email){
        return ResponseUtils.validationErrorResponse(res,'Email không được để trống');
    }
    if(!ValidEmail.isValidEmail(email)){
        return ResponseUtils.validationErrorResponse(res,'Email không hợp lệ');
    }
    if(!otp){
        return ResponseUtils.validationErrorResponse(res,'Mã OTP không được để trống');
    }
    next();
}

//dasd
const validateChangePass=async(req,res,next)=>{
  const {email,passwordOld,passwordNew}=req.body;
  if(!email){
    return ResponseUtils.validationErrorResponse(res,'Email không được để trống');
  }
  if(!ValidEmail.isValidEmail(email)){
    return ResponseUtils.validationErrorResponse(res,'Email không hợp lệ');
  }
  if(!passwordOld){
    return ResponseUtils.validationErrorResponse(res,'Mật khẩu cũ không được để trống');
  }
  if(!passwordNew){
    return ResponseUtils.validationErrorResponse(res,'Mật khẩu mới không được để trống');
  }
  next();
}

export default {validateRegister,validateLogin,validateRefreshToken,validateRequestOtp,validateVerifyOtp,validateChangePass}

