import ResponseUtil from "../../utils/response_utils.js";

const createPaymentValidation = (req, res, next) => {
    try {
        const { amount, userId } = req.body;
        if(!amount){
            return ResponseUtil.validationErrorResponse(res, "amount không được để trống");
        }
        if(amount <= 0){
            return ResponseUtil.validationErrorResponse(res, "amount phải lớn hơn 0");
        }
        if(!userId){
            return ResponseUtil.validationErrorResponse(res, "userId không được để trống");
        }
        next();
    } catch (error) {
        console.error(error);
        return ResponseUtil.errorResponse(res, error.message);
    }
};

export default {
    createPaymentValidation,
};
