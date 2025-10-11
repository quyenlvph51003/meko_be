const ProvinceService=require('../provinces/province.service');
const {successResponse,serverErrorResponse,validationErrorResponse}=require('../../../utils/response_utils');

const provinceController={
    async getProvinces(req,res){
        try{
            const provinces=await ProvinceService.getProvinces();
            return successResponse(res,provinces,'Lấy danh sách tỉnh, thành thành công');
        }catch(error){
            console.log(error);
            return serverErrorResponse(res);
        }
    },
    async getProvinceByCode(req,res){
        try{
            const code=req.params.code;
            if(!code){
                return validationErrorResponse(res,'Mã tỉnh thành không hợp lệ');
            }
            const province=await ProvinceService.getProvinceByCode(code);
            return successResponse(res,province,'Lấy tỉnh thành thành công');
        }catch(error){
            if(error.message==='PROVINCE_NOT_FOUND'){
                return validationErrorResponse(res,'Mã tỉnh thành không hợp lệ');
            }
            console.log(error);
            return serverErrorResponse(res);
        }
    }
}

module.exports=provinceController;
