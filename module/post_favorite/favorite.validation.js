import ResponseUtil from "../../utils/response_utils.js";

const validationCreateFavorite = (req, res, next) => {
    const {postId,userId}=req.body;
    if(!postId){
        return ResponseUtil.validationErrorResponse(res,'Không được để trống postId');
    }
    if(!userId){
        return ResponseUtil.validationErrorResponse(res,'Không được để trống userId');
    }
    next();
}

const validationDeleteFavorite=(req,res,next)=>{
    const {favoriteId}=req.params;
    if(!favoriteId){
        return ResponseUtil.validationErrorResponse(res,'Không được để trống favoriteId');
    }
    next();
}

const validationSearchFavorite=(req,res,next)=>{
    const {userId}=req.body;
    if(!userId){
        return ResponseUtil.validationErrorResponse(res,'Không được để trống userId');
    }
    next();
}
export default {
    validationCreateFavorite,
    validationDeleteFavorite,
    validationSearchFavorite
};
