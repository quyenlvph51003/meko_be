const userService=require('./user.service');
const {successResponse,serverErrorResponse,validationErrorResponse}=require('../../utils/response_utils');
const bcrypt=require('bcrypt');

const userController={
    async createUser(req,res){
        try {
            const {email,password,username}=req.body;
            const hashedPassword=await bcrypt.hash(password,10);

            const user=await userService.createUser({email,password:hashedPassword,username});
        
            return successResponse(res,null,'Tạo tài khoản thành công');
        } catch (error) {
            console.log(error);
            return serverErrorResponse(res);
        }
    },
    async getDetailUser(req,res){
        try {
            const {id}=req.params;
            const user=await userService.findByIdUser(id);
            return successResponse(res,user,'Lấy thông tin người dùng thành công');
        } catch (error) {
            console.log(error);
            return serverErrorResponse(res);
        }
    },
    async uploadAvatar(req,res){
        try{
            const {id}=req.params;
            if (!req.file) {
                return validationErrorResponse(res, 'Vui lòng chọn ảnh để tải lên');
            }
            
            const avatar=req.file?.path;
            const user=await userService.findByIdUser(id);
            if(!user){
                return notFoundResponse(res,'Người dùng không tồn tại');
            }
            if (avatar) {
                user.avatar = avatar;
            }
            const updateUser=await userService.updateUserById(id,user);
            if(!updateUser){
                return serverErrorResponse(res);
            }

            return successResponse(res,updateUser,'Cập nhật ảnh đại diện thành công');
        } catch (error) {
            console.log(error);
            return serverErrorResponse(res);
        }
    }

}

module.exports=userController;
