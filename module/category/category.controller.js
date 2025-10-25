import CategoryService from '../category/category.service.js';
import ReponseUtils from '../../utils/response_utils.js';

const createCategoryController=async(req,res)=>{
    try{
        const name=req.body.name;
        const avatar=req.file.path;
        if(!name){
            return ReponseUtils.validationErrorResponse(res,'Tên danh mục không được để trống');
        }
        if(!avatar){
            return ReponseUtils.validationErrorResponse(res,'Ảnh không được để trống');
        }
        const result=await CategoryService.createCategoryService({name:name,avatar:avatar});
        return ReponseUtils.successResponse(res,result,'Tạo danh mục thành công');
    }catch(error){
        console.log(error);
        return ReponseUtils.serverErrorResponse(res);
    }
}

const updateCategoryController=async(req,res)=>{
    try{
        const name=req.body.name;
        const avatar=req.file.path;
        const id=req.params.id;
        if(!id){
            return ReponseUtils.validationErrorResponse(res,'ID danh mục không được để trống');
        }
        if(!name){
            return ReponseUtils.validationErrorResponse(res,'Tên danh mục không được để trống');
        }
        if(!avatar){
            return ReponseUtils.validationErrorResponse(res,'Ảnh không được để trống');
        }
        await CategoryService.updateCategoryService({name:name,avatar:avatar,id:id});
        const result=await CategoryService.getDetailCategoryService(id);
        return ReponseUtils.successResponse(res,result,'Cập nhật danh mục thành công');
    }catch(error){
        console.log(error);
        return ReponseUtils.serverErrorResponse(res);
    }
}

const getDetailCategoryController=async(req,res)=>{
    try{
        const id=req.params.id;
        if(!id){
            return ReponseUtils.validationErrorResponse(res,'ID danh mục không được để trống');
        }
        const result=await CategoryService.getDetailCategoryService(id);
        return ReponseUtils.successResponse(res,result,'Lấy thông tin danh mục thành công');
    }catch(error){
        console.log(error);
        return ReponseUtils.serverErrorResponse(res);
    }
}

const getListCategoryController=async(req,res)=>{
    try{
        const result=await CategoryService.getListCategoryService();
        return ReponseUtils.successResponse(res,result,'Lấy thông tin danh mục thành công');
    }catch(error){
        console.log(error);
        return ReponseUtils.serverErrorResponse(res);
    }
}


const searchCategoryController=async(req,res)=>{
    try{
        const searchText=req.query.searchText;
        const page=req.query.page;
        const size=req.query.size;
        const sort=req.query.sort;
        // if(!searchText){
        //     return ReponseUtils.validationErrorResponse(res,'Tìm kiếm không được để trống');
        // }
        // if(!Number(page)){
        //     return ReponseUtils.validationErrorResponse(res,'Trang không được để trống');
        // }
        // if(!Number(size)){
        //     return ReponseUtils.validationErrorResponse(res,'Size không được để trống');
        // }
        // if(!sort || sort !== 'asc' && sort !== 'desc'){
        //     return ReponseUtils.validationErrorResponse(res,'Sort không hợp lệ');
        // }
        const result=await CategoryService.searchCategoryService(searchText,page,size,sort);
        return ReponseUtils.successResponse(res,result,'Lấy thông tin danh mục thành công');
    }catch(error){
        console.log(error);
        return ReponseUtils.serverErrorResponse(res);
    }
}


export default {
    createCategoryController,
    updateCategoryController,
    getDetailCategoryController,
    getListCategoryController,
    searchCategoryController
}