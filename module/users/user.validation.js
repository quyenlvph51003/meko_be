const {isValidEmail}=require('../../utils/validate_utils');
const {validationErrorResponse}=require('../../utils/response_utils');
const UserRepo=require('./user.repository');

const createUserValidation=async(req,res,next)=>{
    const {email,password,username,address}=req.body;
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


const updateUserValidation=async(req,res,next)=>{
   const {userId,username,address,isActive}=req.body;
   
   if(!userId){
    return validationErrorResponse(res,'userId không được để trống');
   }
   if(!username){
    return validationErrorResponse(res,'Tên không được để trống');
   }
   next();
}

const searchUserValidation=async(req,res,next)=>{
    const {page,size,searchText,orderBy,sort}=req.query;
    if(!page || !size){
        return validationErrorResponse(res,'Thiếu thông tin');
    }
    if(Number(page)<0 || Number(size)<1){
        return validationErrorResponse(res,'Tham số không hợp lệ');
    }
    if (sort) {
        const validSorts = ['ASC', 'asc', 'DESC', 'desc'];
        if (!validSorts.includes(sort)) {
            return validationErrorResponse(res, 'Tham số sort không hợp lệ');
        }
    }
    next();
}

module.exports={createUserValidation,updateUserValidation,searchUserValidation}