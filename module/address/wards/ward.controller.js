const WardService=require('../wards/ward.service');
const {successResponse,serverErrorResponse,validationErrorResponse}=require('../../../utils/response_utils');
const wardController={
    async getWards(req,res){
        try{
            const wards=await WardService.getWards();
            return successResponse(res,wards,'Lấy danh sách xã, phường thành công');
        }catch(error){
            console.log(error);
            return serverErrorResponse(res);
        }
    },
    async getWardByCode(req,res){
        try{
            const code=req.params.code;
            if(!code){
                return validationErrorResponse(res,'Mã xã, phường không hợp lệ');
            }
            const ward=await WardService.getWardByCode(code);
            return successResponse(res,ward,'Lấy xã, phường thành công');
        }catch(error){
            if(error.message==='WARD_NOT_FOUND'){
                return validationErrorResponse(res,'Mã xã, phường không hợp lệ');
            }
            console.log(error);
            return serverErrorResponse(res);
        }
    },
    async getWardsByProvinceCode(req,res){
        try{
            const provinceCode=req.query.provinceCode;
            console.log(provinceCode);
            if(!provinceCode){
                return validationErrorResponse(res,'Mã tỉnh thành không hợp lệ');
            }
            const wards=await WardService.getWardsByProvinceCode(provinceCode);
            return successResponse(res,wards,'Lấy danh sách xã, phường thành công');
        }catch(error){
            console.log(error);
            return serverErrorResponse(res);
        }
    }
}
module.exports=wardController;
