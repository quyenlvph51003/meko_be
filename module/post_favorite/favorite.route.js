import express from "express";
import Controller from "./favorite.controller.js";
import Middleware from "../../middlewares/authenticate.js";
import Validation from "./favorite.validation.js";

const router = express.Router();
router.post('/create', Middleware.authenticate,Validation.validationCreateFavorite, Controller.createFavoriteController);
router.delete('/delete/:favoriteId', Middleware.authenticate,Validation.validationDeleteFavorite, Controller.deleteFavoriteController);
router.post('/search', Middleware.authenticate,Validation.validationSearchFavorite, Controller.searchFavoriteController);
router.delete('/delete', Middleware.authenticate, Controller.deleteByPostIdUserIdController);
export default router;
