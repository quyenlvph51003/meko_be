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

      if (!password) {
        return validationErrorResponse(res, 'Mật khẩu không được để trống');
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

module.exports={validateRegister,validateLogin,validateRefreshToken}
