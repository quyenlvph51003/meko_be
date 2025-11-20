import ResponseUtils from "../../utils/response_utils.js";

const createPaymentPackageValidation = (req, res, next) => {
    const{name,price,description,durationDays,usageLimit,expiredAt}=req.body;
    if(!name){
        return ResponseUtils.validationErrorResponse(res,'Thiếu tên gói');
    }
    if(!price && isNaN(price)){
        return ResponseUtils.validationErrorResponse(res,'Thiếu giá gói');
    }
    if(!description){
        return ResponseUtils.validationErrorResponse(res,'Thiếu mô tả gói');
    }
    if(!durationDays && isNaN(durationDays)){
        return ResponseUtils.validationErrorResponse(res,'Thiếu thời gian sử dụng gói');
    }
    if(!usageLimit && isNaN(usageLimit)){
        return ResponseUtils.validationErrorResponse(res,'Thiếu giới hạn sử dụng gói(số lượt)');
    }
    // Kiểm tra durationDays là số nguyên
    if(!Number.isInteger(Number(durationDays))){
        return ResponseUtils.validationErrorResponse(res,'Thời gian sử dụng gói phải là số nguyên');
    }
    // Kiểm tra usageLimit là số nguyên
    if(!Number.isInteger(Number(usageLimit))){
        return ResponseUtils.validationErrorResponse(res,'Giới hạn sử dụng gói phải là số nguyên');
    }
    // const expiredDate = new Date(expiredAt);

    // if (!expiredAt || isNaN(expiredDate.getTime())) {
    //     return ResponseUtils.validationErrorResponse(res, 'Thời gian hết hạn không hợp lệ');
    // }

    // if (expiredDate <= new Date()) {
    //     return ResponseUtils.validationErrorResponse(res, 'Thời gian hết hạn phải lớn hơn hiện tại');
    // }
    next();
}

const updatePaymentPackageValidation = (req, res, next) => {
    const { expiredAt } = req.body;
    const expiredDate = new Date(expiredAt);

    if(expiredAt){
        if (!expiredAt || isNaN(expiredDate.getTime())) {
            return ResponseUtils.validationErrorResponse(res, 'Thời gian hết hạn không hợp lệ');
        }
    
        if (expiredDate <= new Date()) {
            return ResponseUtils.validationErrorResponse(res, 'Thời gian hết hạn phải lớn hơn hiện tại');
        }
    }
    next();
}

const deletePaymentPackageValidation = (req, res, next) => {
    next();
}

const getPaymentPackageValidation = (req, res, next) => {
    next();
}

const getAllPaymentPackageValidation = (req, res, next) => {
    next();
}

export default {
    createPaymentPackageValidation,
    updatePaymentPackageValidation,
    deletePaymentPackageValidation,
    getPaymentPackageValidation,
    getAllPaymentPackageValidation
}
