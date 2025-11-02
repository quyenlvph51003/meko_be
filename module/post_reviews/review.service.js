import ReviewRepository from "./review.repository.js";
import User from "../users/user.repository.js";
import Post from "../post/post.repository.js";

class ReviewService {

    async createReview(reviewData) {
        const {comment,postId,userId,parentId} = reviewData;

        const user = await User.findById(userId);
        const post = await Post.findById(postId);

        if (!user) {
            throw new Error("User not found");
        }

        if (!post) {
            throw new Error("Post not found");
        }
        if(parentId){
            const parent = await ReviewRepository.findById(parentId);
            if (!parent) {
                throw new Error("Parent not found");
            }
        }

        return await ReviewRepository.createReview({comment,post_id:postId,user_id:userId,parent_id:parentId});
    }

    async updateReview(reviewId,comment){
        const review = await ReviewRepository.findById(reviewId);
        console.log(comment);
        
        if (!review) {
            throw new Error("Review not found");
        }
        const updateReview = await ReviewRepository.updateReview(reviewId,{comment});
        if (!updateReview) {
            throw new Error("Update review failed");
        }
        return ReviewRepository.findById(reviewId);
    }

    async deleteReview(reviewId){
        const review = await ReviewRepository.findById(reviewId);
        if (!review) {
            throw new Error("Review not found");
        }
        return await ReviewRepository.deleteReview(reviewId);
    }
}

export default new ReviewService();
