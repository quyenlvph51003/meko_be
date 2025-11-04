import express from "express";
import validation from "./payment.validation.js";
import controller from "./pament.controller.js";

const router = express.Router();
router.post("/create-payment", validation.createPaymentValidation, controller.createPayment);
router.get("/vnpay_return", controller.vnp_ReturnUrl);
export default router;
