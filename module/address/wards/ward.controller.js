import WardService from '../wards/ward.service.js';
import ResponseUtils from '../../../utils/response_utils.js';
const wardController={
    async getWards(req,res){
        try{
            const wards=await WardService.getWards();
            return ResponseUtils.successResponse(res,wards,'Lấy danh sách xã, phường thành công');
        }catch(error){
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    },
    async getWardByCode(req,res){
        try{
            const code=req.params.code;
            if(!code){
                return ResponseUtils.validationErrorResponse(res,'Mã xã, phường không hợp lệ');
            }
            const ward=await WardService.getWardByCode(code);
            return ResponseUtils.successResponse(res,ward,'Lấy xã, phường thành công');
        }catch(error){
            if(error.message==='WARD_NOT_FOUND'){
                return ResponseUtils.validationErrorResponse(res,'Mã xã, phường không hợp lệ');
            }
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    },
    async getWardsByProvinceCode(req,res){
        try{
            const provinceCode=req.query.provinceCode;
            console.log(provinceCode);
            if(!provinceCode){
                return ResponseUtils.validationErrorResponse(res,'Mã tỉnh thành không hợp lệ');
            }
            const wards=await WardService.getWardsByProvinceCode(provinceCode);
            return ResponseUtils.successResponse(res,wards,'Lấy danh sách xã, phường thành công');
        }catch(error){
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    }
}
export default wardController;
