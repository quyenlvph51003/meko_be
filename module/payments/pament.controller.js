import VNPayService from "./service/vnpay.service.js";
import ResponseUtil from "../../utils/response_utils.js";
const createPayment = async (req, res) => {
    try {
        const { amount, userId } = req.body;
        const ipAddr =
                    req.headers["x-forwarded-for"] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress;
        const paymentUrl = await VNPayService.createPayment(amount, userId,ipAddr);
        return ResponseUtil.successResponse(res, paymentUrl);
    } catch (error) {
        if(error.message === "User not found"){
            return ResponseUtil.notFoundResponse(res, error.message);
        }
        console.error(error);
        return ResponseUtil.serverErrorResponse(res, error.message);
    }
};


const vnp_ReturnUrl = async (req, res) => {
    try {
        const result=await VNPayService.vnp_ReturnUrl(req.query);
        return ResponseUtil.successResponse(res, result);
    } catch (error) {
        if(error.message === "Chữ ký không hợp lệ"){
            return ResponseUtil.validationErrorResponse(res, 'Chữ ký không hợp lệ');
        }
        console.error(error);
        return ResponseUtil.serverErrorResponse(res, error.message);
    }
};
export default {
    createPayment,
    vnp_ReturnUrl,
};

