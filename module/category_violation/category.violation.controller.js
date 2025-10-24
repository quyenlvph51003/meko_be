import ViolationService from "./category.violation.service.js";
import ReponseUtils from '../../utils/response_utils.js'; 


const createViolationController=async(req,res)=>{
    try{
        const name=req.body.name;
        const result=await ViolationService.createCategoryViolationService(name);
        return ReponseUtils.successResponse(res,null,'Tạo danh mục vi phạm thành công');
    }catch(error){
        console.log(error);
        return ReponseUtils.serverErrorResponse(res);
    }
}

const updateViolationController=async(req,res)=>{
    try{
        const name=req.body.name;
        const result=await ViolationService.updateCategoryViolationService(name,req.params.id);
        return ReponseUtils.successResponse(res,result,'Cập nhật danh mục vi phạm thành công');
    }catch(error){
        console.log(error);
        return ReponseUtils.serverErrorResponse(res);
    }
}

const deleteViolationController=async(req,res)=>{
    try{
        const result=await ViolationService.deleteCategoryViolationService(req.params.id);
        return ReponseUtils.successResponse(res,null,'Xóa danh mục vi phạm thành công');
    }catch(error){
        console.log(error);
        return ReponseUtils.serverErrorResponse(res);
    }
}
const getDetailViolationController=async(req,res)=>{
    try{
        const result=await ViolationService.getDetailViolationService(req.params.id);
        return ReponseUtils.successResponse(res,result,'Lấy thông tin danh mục vi phạm thành công');
    }catch(error){
        console.log(error);
        return ReponseUtils.serverErrorResponse(res);
    }
}

const getListViolationController=async(req,res)=>{
    try{
        const result=await ViolationService.getAllViolationService();
        return ReponseUtils.successResponse(res,result,'Lấy danh sách danh mục vi phạm thành công');
    }catch(error){
        console.log(error);
        return ReponseUtils.serverErrorResponse(res);

    }
}

export default {
    createViolationController,
    updateViolationController,
    deleteViolationController,
    getDetailViolationController,
    getListViolationController
}
