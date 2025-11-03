import express from "express";
import controller from "./review.controller.js";
import validation from "./review.validation.js";
import middleware from "../../middlewares/authenticate.js";

const router = express.Router();

router.post("/create", middleware.authenticate, validation.createReviewValidation, controller.createReview);
router.put("/update/:reviewId", middleware.authenticate, validation.updateReviewValidation, controller.updateReview);
router.delete("/delete/:reviewId", middleware.authenticate, validation.deleteReviewValidation, controller.deleteReview);
router.get("/list/:postId",validation.getListReviewValidation, controller.getListReview);
router.get("/list-by-tab", middleware.authenticate, controller.getListReviewByPostIdOrUserId);
export default router;
