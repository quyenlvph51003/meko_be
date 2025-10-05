const authService=require('./auth.service');
const jwt=require('jsonwebtoken');
const {successResponse,serverErrorResponse,validationErrorResponse}=require('../../utils/response_utils');

const authController={
    async register(req,res){
        try {
            const {email,password,username}=req.body;
            const user=await authService.register({email,password,username,res});
        
            return successResponse(res,null,'Đăng ký thành công');
        } catch (error) {
            return serverErrorResponse(res,error);
        }
    },
    
    async login(req,res){
        try {
            const {email,password}=req.body;
            const user=await authService.login({email,password});
            const token=jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:'2h'});

            user.refresh_token=jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:'7d'});
            user.token_expired = new Date(Date.now() + 2 * 60 * 60 * 1000);
            user.refresh_expired = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            
            await authService.updateWhereService(user);
            
            return successResponse(res,{
                'token': token,
                'refreshToken': user.refresh_token,
                'tokenExpired': user.token_expired,
                'refreshTokenExpired': user.refresh_expired,
                // 'user': user
            },'Đăng nhập thành công');
        } catch (error) {
            if(error.message==='Email_NOT_FOUND'){
                return validationErrorResponse(res,'Email không tồn tại');
            }
            if(error.message==='PASSWORD_NOT_VALID'){
                return validationErrorResponse(res,'Mật khẩu không chính xác');
            }
            return serverErrorResponse(res,error);
        }
    },

    async refreshToken(req,res){
        try{
            const {refreshToken,email}=req.body;
            
            const user=await authService.refreshTokenService(email,refreshToken,res);


            const token=jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:'2h'});

            user.refresh_token=jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:'7d'});
            user.token_expired = new Date(Date.now() + 2 * 60 * 60 * 1000);
            user.refresh_expired = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            
            await authService.updateWhereService(user);
            
            return successResponse(res,{
                'token': token,
                'refreshToken': user.refresh_token,
                'tokenExpired': user.token_expired,
                'refreshTokenExpired': user.refresh_expired,
            },'Refresh token thành công');

            
        }catch(error){
            if(error.message==='INVALID_TOKEN'){
                return validationErrorResponse(res,'Token không hợp lệ hoặc Email không hợp lệ');
            }
            return serverErrorResponse(res,error);
        }
    }
}

module.exports=authController;
