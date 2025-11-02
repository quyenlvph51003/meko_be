import ReviewService from "./review.service.js";
import ResponseUtile from "../../utils/response_utils.js";

const createReview = async (req, res) => {
    try {
        const review = await ReviewService.createReview(req.body);
        return ResponseUtile.successResponse(res,null, 'Tạo bình luận thành công');
    } catch (error) {

        if(error.message === 'User not found'){
            return ResponseUtile.notFoundResponse(res, 'Người dùng không tồn tại');
        }
        if(error.message === 'Post not found'){
            return ResponseUtile.notFoundResponse(res, 'Bài viết không tồn tại');
        }
        if(error.message === 'Parent not found'){
            return ResponseUtile.notFoundResponse(res, 'Bình luận cha không tồn tại');
        }
        console.log(error);
        
        return ResponseUtile.errorResponse(res, error.message);
    }
};

const updateReview = async (req, res) => {
    try {

        const review = await ReviewService.updateReview(req.params.reviewId, req.body.comment);
        return ResponseUtile.successResponse(res, review, 'Cập nhật bình luận thành công');
    } catch (error) {
        if(error.message === 'Review not found'){
            return ResponseUtile.notFoundResponse(res, 'Bình luận không tồn tại');
        }
        if(error.message === 'Update review failed'){
            return ResponseUtile.errorResponse(res, 'Cập nhật bình luận thất bại');
        }
        console.log(error);
        return ResponseUtile.errorResponse(res, error.message);
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await ReviewService.deleteReview(req.params.reviewId);
        return ResponseUtile.successResponse(res, null, 'Xóa bình luận thành công');
    } catch (error) {
        if(error.message === 'Review not found'){
            return ResponseUtile.notFoundResponse(res, 'Bình luận không tồn tại');
        }
        console.log(error);
        return ResponseUtile.errorResponse(res, error.message);
    }
};

export default {
    createReview,
    updateReview,
    deleteReview
};
