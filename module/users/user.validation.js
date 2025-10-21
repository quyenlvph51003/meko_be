import ValidateEmail from '../../utils/validate_utils.js';
import ResponseUtils from '../../utils/response_utils.js';
import UserRepo from './user.repository.js';

const createUserValidation=async(req,res,next)=>{
    const {email,password,username,address}=req.body;
    if(!email){
        return ResponseUtils.validationErrorResponse(res,'Email không được để trống');
    }
    if(!ValidateEmail.isValidEmail(email)){
        return ResponseUtils.validationErrorResponse(res,'Email không hợp lệ');
    }
    if(!username){
        return ResponseUtils.validationErrorResponse(res,'Tên không được để trống');
    }
    if(!password || password.length<6){
        return ResponseUtils.validationErrorResponse(res,'Mật khẩu không được để trống và phải có ít nhất 6 ký tự');
    }
    const existsUser=await UserRepo.findByEmailUserRepo(email);
    if(existsUser){
        return ResponseUtils.validationErrorResponse(res,'Email đã tồn tại');
    }    
    next();
}


const updateUserValidation=async(req,res,next)=>{
   const {userId,username,address,isActive}=req.body;
   
   if(!userId){
    return ResponseUtils.validationErrorResponse(res,'userId không được để trống');
   }
   if(!username){
    return ResponseUtils.validationErrorResponse(res,'Tên không được để trống');
   }
   next();
}

const searchUserValidation=async(req,res,next)=>{
    const {page,size,searchText,orderBy,sort}=req.query;
    if(!page || !size){
        return ResponseUtils.validationErrorResponse(res,'Thiếu thông tin');
    }
    if(Number(page)<0 || Number(size)<1){
        return ResponseUtils.validationErrorResponse(res,'Tham số không hợp lệ');
    }
    if (sort) {
        const validSorts = ['ASC', 'asc', 'DESC', 'desc'];
        if (!validSorts.includes(sort)) {
            return ResponseUtils.validationErrorResponse(res, 'Tham số sort không hợp lệ');
        }
    }
    next();
}

export default {createUserValidation,updateUserValidation,searchUserValidation}