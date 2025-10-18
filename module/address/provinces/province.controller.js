import ProvinceService from '../provinces/province.service.js';
import ResponseUtils from '../../../utils/response_utils.js';

const provinceController={
    async getProvinces(req,res){
        try{
            const provinces=await ProvinceService.getProvinces();
            return ResponseUtils.successResponse(res,provinces,'Lấy danh sách tỉnh, thành thành công');
        }catch(error){
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    },
    async getProvinceByCode(req,res){
        try{
            const code=req.params.code;
            if(!code){
                return ResponseUtils.validationErrorResponse(res,'Mã tỉnh thành không hợp lệ');
            }
            const province=await ProvinceService.getProvinceByCode(code);
            return ResponseUtils.successResponse(res,province,'Lấy tỉnh thành thành công');
        }catch(error){
            if(error.message==='PROVINCE_NOT_FOUND'){
                return ResponseUtils.validationErrorResponse(res,'Mã tỉnh thành không hợp lệ');
            }
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    }
}

export default provinceController;
