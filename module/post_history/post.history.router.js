import express from "express";
import controller from "./post.history.controller.js"; 
import Middleware from "../../middlewares/authenticate.js";
const router=express.Router();
router.get('/search/:userId',Middleware.authenticate,controller.searchHistoryController);
export default router;
