import FavoriteService from "./favorite.service.js";
import ResponseUtil from "../../utils/response_utils.js";

const createFavoriteController = async (req, res) => {
    try {
        const result = await FavoriteService.createFavorite(req.body);
        if(result!=null){
            return ResponseUtil.successResponse(res, result,'Bài viết đã được thêm vào danh sách yêu thích');
        }
        return ResponseUtil.errorResponse(res, 'Lỗi hệ thống, vui lòng liên hệ quản trị viên');
    } catch (error) {
        if(error.message==='Post not found'){
            return ResponseUtil.notFoundResponse(res,'Bài viết không tồn tại');
        }
        if(error.message==='User not found'){
            return ResponseUtil.notFoundResponse(res,'Người dùng không tồn tại');
        }
        if(error.message==='Favorite already exists'){
            return ResponseUtil.notFoundResponse(res,'Bài viết đã được tồn tại trong danh sách yêu thích');
        }
        if(error.message==='Post is not approved'){
            return ResponseUtil.notFoundResponse(res,'Bài viết chưa được duyệt');
        }

        console.log(error);
        return ResponseUtil.errorResponse(res, error);
    }
}

const deleteFavoriteController = async (req, res) => {
    try {
        const result = await FavoriteService.deleteFavorite(req.params.favoriteId);
        if(result){
            return ResponseUtil.successResponse(res, null,'Xoá bài viết yêu thích thành công');
        }
        return ResponseUtil.errorResponse(res, 'Lỗi hệ thống, vui lòng liên hệ quản trị viên');
    } catch (error) {
        if(error.message === 'Favorite not found'){
            return ResponseUtil.notFoundResponse(res,'Bài viết yêu thích không tồn tại');
        }
        console.log(error);
        
        return ResponseUtil.errorResponse(res, error);
    }
}
const searchFavoriteController=async(req,res)=>{
    try{
        const result = await FavoriteService.searchFavoriteService(req.body.userId,req.body.searchText,req.query.page,req.query.size);
        return ResponseUtil.successResponse(res, result);
    }catch(error){
        if(error.message==='User not found'){
            return ResponseUtil.notFoundResponse(res,'Người dùng không tồn tại');
        }
        console.log(error);
        return ResponseUtil.errorResponse(res, error);
    }
}
const deleteByPostIdUserIdController=async(req,res)=>{
    try{
        const postId=req.query.postId;
        const userId=req.query.userId;
        if(!postId || !userId){
            return ResponseUtil.errorResponse(res, 'Thiếu tham số userId hoặc postId');
        }
        const result = await FavoriteService.deleteByPostIdUserId(postId,userId);
        if(result){
            return ResponseUtil.successResponse(res, null,'Xoá bài viết yêu thích thành công');
        }
        return ResponseUtil.errorResponse(res, 'Lỗi hệ thống, vui lòng liên hệ quản trị viên');
    }catch(error){
        if(error.message === 'Favorite not found'){
            return ResponseUtil.notFoundResponse(res,'Bài viết yêu thích không tồn tại');
        }
        console.log(error);
        
        return ResponseUtil.errorResponse(res, error);
    }
}
export default {
    createFavoriteController,
    deleteFavoriteController,
    searchFavoriteController,
    deleteByPostIdUserIdController
}