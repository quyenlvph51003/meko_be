const CategoryService=require('../category/category.service');
const {successResponse,serverErrorResponse,validationErrorResponse,notFoundResponse}=require('../../utils/response_utils');

const createCategoryController=async(req,res)=>{
    try{
        const name=req.body.name;
        const avatar=req.file.path;
        if(!name){
            return validationErrorResponse(res,'Tên danh mục không được để trống');
        }
        if(!avatar){
            return validationErrorResponse(res,'Ảnh không được để trống');
        }
        const result=await CategoryService.createCategoryService({name:name,avatar:avatar});
        return successResponse(res,result,'Tạo danh mục thành công');
    }catch(error){
        console.log(error);
        return serverErrorResponse(res);
    }
}

const updateCategoryController=async(req,res)=>{
    try{
        const name=req.body.name;
        const avatar=req.file.path;
        const id=req.params.id;
        if(!id){
            return validationErrorResponse(res,'ID danh mục không được để trống');
        }
        if(!name){
            return validationErrorResponse(res,'Tên danh mục không được để trống');
        }
        if(!avatar){
            return validationErrorResponse(res,'Ảnh không được để trống');
        }
        await CategoryService.updateCategoryService({name:name,avatar:avatar,id:id});
        const result=await CategoryService.getDetailCategoryService(id);
        return successResponse(res,result,'Cập nhật danh mục thành công');
    }catch(error){
        console.log(error);
        return serverErrorResponse(res);
    }
}

const getDetailCategoryController=async(req,res)=>{
    try{
        const id=req.params.id;
        if(!id){
            return validationErrorResponse(res,'ID danh mục không được để trống');
        }
        const result=await CategoryService.getDetailCategoryService(id);
        return successResponse(res,result,'Lấy thông tin danh mục thành công');
    }catch(error){
        console.log(error);
        return serverErrorResponse(res);
    }
}

const getListCategoryController=async(req,res)=>{
    try{
        const result=await CategoryService.getListCategoryService();
        return successResponse(res,result,'Lấy thông tin danh mục thành công');
    }catch(error){
        console.log(error);
        return serverErrorResponse(res);
    }
}


module.exports={createCategoryController,updateCategoryController,getDetailCategoryController,getListCategoryController}