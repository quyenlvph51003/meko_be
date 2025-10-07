const {isValidEmail}=require('../../utils/validate_utils');
const {validationErrorResponse}=require('../../utils/response_utils');
const UserRepo=require('./user.repository');

const createUserValidation=async(req,res,next)=>{
    const {email,password,username}=req.body;
    if(!email){
        return validationErrorResponse(res,'Email không được để trống');
    }
    if(!isValidEmail(email)){
        return validationErrorResponse(res,'Email không hợp lệ');
    }
    if(!username){
        return validationErrorResponse(res,'Tên không được để trống');
    }
    if(!password || password.length<6){
        return validationErrorResponse(res,'Mật khẩu không được để trống và phải có ít nhất 6 ký tự');
    }
    const existsUser=await UserRepo.findByEmailUserRepo(email);
    if(existsUser){
        return validationErrorResponse(res,'Email đã tồn tại');
    }    
    next();
}


module.exports={createUserValidation}