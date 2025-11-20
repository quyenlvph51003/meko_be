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

//user mua gói
const createPaymentPacakgeVaidation = (req,res,next)=>{
    try {
        const {userId,packageId,amount,pinWallet}=req.body;
        if(!userId){
            return ResponseUtil.validationErrorResponse(res, "Id người dùng không được để trống");
        }
        if(!packageId){
            return ResponseUtil.validationErrorResponse(res, "Id gói không được để trống");
        }
        if(!amount){
            return ResponseUtil.validationErrorResponse(res, "Số tiền không được để trống");
        }
        if(amount <= 0){
            return ResponseUtil.validationErrorResponse(res, "Số tiền phải lớn hơn 0");
        }
        if(!pinWallet){
            return ResponseUtil.validationErrorResponse(res, "Mã pin không được để trống");
        }
        next();
    } catch (error) {
        console.error(error);
        return ResponseUtil.errorResponse(res, error.message);
    }
}

export default {
    createPaymentValidation,
    createPaymentPacakgeVaidation
};
