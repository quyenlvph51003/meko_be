import ResponseUtile from "../../utils/response_utils.js";


const createReviewValidation = (req, res, next) => {
    const {comment,postId,userId} = req.body;
    if(!comment){
        return ResponseUtile.validationErrorResponse(res,"Bình luận không được để trống");
    }
    if(!postId){
        return ResponseUtile.validationErrorResponse(res,"ID bài viết không được để trống");
    }
    if(!userId){
        return ResponseUtile.validationErrorResponse(res,"ID người dùng không được để trống");
    }
    next();
}
const updateReviewValidation = (req, res, next) => {
    const {comment} = req.body;
    if(!comment){
        return ResponseUtile.validationErrorResponse(res,"Bình luận không được để trống");
    }
    next();
}
const deleteReviewValidation = (req, res, next) => {
    const {reviewId} = req.params;
    if(!reviewId){
        return ResponseUtile.validationErrorResponse(res,"ID bình luận không được để trống");
    }
    next();
}
export default {
    createReviewValidation,
    updateReviewValidation,
    deleteReviewValidation
};