import userService from './user.service.js';
import ResponseUtils from '../../utils/response_utils.js';
import bcrypt from 'bcrypt';

const userController={
    async createUser(req,res){
        try {
            const {email,password,username,address}=req.body;
            const hashedPassword=await bcrypt.hash(password,10);

            const user=await userService.createUser({email,password:hashedPassword,username,address_name:address});
        
            return ResponseUtils.successResponse(res,null,'Tạo tài khoản thành công');
        } catch (error) {
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    },
    async getDetailUser(req,res){
        try {
            const {id}=req.params;
            const user=await userService.findByIdUser(id);
            return ResponseUtils.successResponse(res,user,'Lấy thông tin người dùng thành công');
        } catch (error) {
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    },
    async uploadAvatar(req,res){
        try{
            const {id}=req.params;
            if (!req.file) {
                return ResponseUtils.validationErrorResponse(res, 'Vui lòng chọn ảnh để tải lên');
            }
            
            const avatar=req.file?.path;
            const user=await userService.findByIdUser(id);
            if(!user){
                return ResponseUtils.notFoundResponse(res,'Người dùng không tồn tại');
            }
            if (avatar) {
                user.avatar = avatar;
            }
            const updateUser=await userService.updateUserById(id,user);
            if(!updateUser){
                return ResponseUtils.serverErrorResponse(res);
            }

            return ResponseUtils.successResponse(res,updateUser,'Cập nhật ảnh đại diện thành công');
        } catch (error) {
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    },

    async updateUserController(req,res){
        try {
            const {userId,username,address,isActive}=req.body;
            const user=await userService.findByIdUser(userId);
            if(!user){
                return ResponseUtils.notFoundResponse(res,'Người dùng không tồn tại');
            }
            user.username=username;
            user.address_name=address;
            if (typeof isActive !== 'undefined') {
                if (user.role == 1) { //admin mới có quyền cập nhật
                    user.is_active = isActive;
                } 
                else {
                    return ResponseUtils.validationErrorResponse(res, 'Bạn không có quyền thay đổi trạng thái người dùng');
                }
            }
            
            const updateUser=await userService.updateUserById(userId,user);

            if(!updateUser){
                return ResponseUtils.serverErrorResponse(res);
            }
            return ResponseUtils.successResponse(res,updateUser,'Cập nhật thông tin người dùng thành công');
        } catch (error) {
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    },

    async searchUserController(req,res){
        try {
            const {page,size,searchText,orderBy,sort}=req.query;
            const pageNum=Number(page);
            const pageSize=Number(size);
            const users=await userService.searchUser(pageNum,pageSize,searchText,orderBy,sort);
            return ResponseUtils.successResponse(res,users,'Lấy thông tin người dùng thành công');
        } catch (error) {
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    }

}

export default userController;
