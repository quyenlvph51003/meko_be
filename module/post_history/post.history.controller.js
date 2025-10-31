import PostHistoryRepo from "./post.history.repository.js";
import ResponseUtils from "../../utils/response_utils.js";
import UserRepository from "../users/user.repository.js";

const searchHistoryController=async(req,res)=>{
    try {
        const userId=req.params.userId;
        const page=req.query.page;
        const size=req.query.size;
        const searchText=req.query.searchText;
        if(!userId){
            return ResponseUtils.validationErrorResponse(res,'userId không được để trống ở params');
        }
        const userExists=await UserRepository.findById(userId);
        if(!userExists){
            return ResponseUtils.notFoundResponse(res,'Người dùng không tồn tại');
        }
        const result=await PostHistoryRepo.searchHistoryRepo(userId,page,size,searchText);
    return ResponseUtils.successResponse(res,result);
    } catch (error) {
        return ResponseUtils.errorResponse(res,error.message);
    }
}

export default {
    searchHistoryController
}
