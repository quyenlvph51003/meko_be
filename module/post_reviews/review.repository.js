import BaseService from "../../base_service/base_service.js";   

class ReviewRepository extends BaseService {
    constructor() {
        super("post_reviews");
    };

    async createReview(reviewData) {
        return await this.create(reviewData);
    }

    async updateReview(reviewId, reviewData) {
        return await this.update(reviewId, reviewData);
    }

    async deleteReview(reviewId) {
        return await this.delete(reviewId);
    }
}

export default new ReviewRepository();
